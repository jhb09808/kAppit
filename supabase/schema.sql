-- kAppit · Supabase schema
-- Run in the SQL editor of a fresh Supabase project. PostGIS is on by default in Supabase.
--
-- Privacy is enforced HERE, not in the client:
--   * exact locations live in columns the client can never read (RLS + a view)
--   * the client only ever sees approx_* columns, jittered once at write time
--   * meal/event addresses are released only to confirmed guests via a function

create extension if not exists postgis;

-- ---------- profiles ----------
create type person_type as enum ('new_arrival','friends','dating','cook','student','ate_kuya','free_now','konduktor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  photo_url text,
  region_ph text,                       -- "Iloilo", "Cebu" — where in the Philippines
  bio text,
  primary_type person_type not null default 'friends',
  open_to_friends boolean not null default true,
  open_to_dating boolean not null default false,
  is_new_arrival boolean not null default false,
  is_verified boolean not null default false,
  is_visible boolean not null default false,   -- hidden until they say yes
  exact_location geography(point, 4326),        -- NEVER exposed
  approx_location geography(point, 4326),       -- jittered 200–400 m, stable
  updated_at timestamptz not null default now()
);

-- ---------- meals (food share) ----------
create table meals (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  dish text not null,
  note text,
  starts_at timestamptz not null,
  seats_total int not null check (seats_total between 1 and 20),
  exact_location geography(point, 4326) not null,   -- NEVER exposed
  approx_location geography(point, 4326) not null,
  address text,                                     -- released only to confirmed guests
  created_at timestamptz not null default now()
);

-- ---------- events ----------
create type event_kind as enum ('birthday','karaoke','sports','gathering');

create table events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  kind event_kind not null default 'gathering',
  description text,
  starts_at timestamptz not null,
  venue text,
  open_to_everyone boolean not null default true,
  exact_location geography(point, 4326) not null,
  approx_location geography(point, 4326) not null,
  address text,
  created_at timestamptz not null default now()
);

-- ---------- joining: sakay / sabit ----------
create type rsvp_status as enum ('pending','confirmed','declined','sabit');   -- sabit = waitlist

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  meal_id uuid references meals(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  status rsvp_status not null default 'pending',
  created_at timestamptz not null default now(),
  check ((meal_id is null) <> (event_id is null)),
  unique (user_id, meal_id), unique (user_id, event_id)
);

-- ---------- spots (businesses: exact is fine) ----------
create table spots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  location geography(point, 4326) not null
);

-- ---------- chat ----------
create table conversations (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid references meals(id) on delete cascade,     -- a thread spins up per meal
  event_id uuid references events(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table conversation_members (
  conversation_id uuid references conversations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (conversation_id, user_id)
);
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default now()
);

-- ---------- safety ----------
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id),
  reported_user_id uuid not null references profiles(id),
  reason text not null,
  context text,
  created_at timestamptz not null default now()
);
create table blocks (
  user_id uuid references profiles(id) on delete cascade,
  blocked_user_id uuid references profiles(id) on delete cascade,
  primary key (user_id, blocked_user_id)
);

-- ---------- jitter: 200–400 m, seeded by the row id so it never wanders ----------
create or replace function jitter_point(p geography, seed uuid) returns geography language sql immutable as $$
  select st_project(
    p::geography,
    200 + (('x' || substr(md5(seed::text), 1, 8))::bit(32)::int & 2147483647) % 200,   -- distance m
    radians((('x' || substr(md5(seed::text), 9, 8))::bit(32)::int & 2147483647) % 360)  -- bearing
  )::geography
$$;

create or replace function set_approx() returns trigger language plpgsql as $$
begin
  if new.exact_location is not null then new.approx_location := jitter_point(new.exact_location, new.id); end if;
  return new;
end $$;
create trigger profiles_approx before insert or update of exact_location on profiles for each row execute function set_approx();
create trigger meals_approx    before insert or update of exact_location on meals    for each row execute function set_approx();
create trigger events_approx   before insert or update of exact_location on events   for each row execute function set_approx();

-- ---------- what the client reads: views with NO exact columns ----------
create view public_profiles as
  select id, display_name, photo_url, region_ph, bio, primary_type, open_to_friends, open_to_dating,
         is_new_arrival, is_verified,
         st_x(approx_location::geometry) as approx_lng, st_y(approx_location::geometry) as approx_lat
  from profiles where is_visible;

create view public_meals as
  select m.id, m.host_id, m.dish, m.note, m.starts_at, m.seats_total,
         (select count(*) from rsvps r where r.meal_id = m.id and r.status = 'confirmed')::int as seats_taken,
         (m.starts_at::date = (now() at time zone 'utc')::date) as is_live,
         st_x(m.approx_location::geometry) as approx_lng, st_y(m.approx_location::geometry) as approx_lat
  from meals m where m.starts_at > now() - interval '3 hours';

create view public_events as
  select e.id, e.host_id, e.title, e.kind, e.description, e.starts_at, e.venue, e.open_to_everyone,
         (select count(*) from rsvps r where r.event_id = e.id and r.status = 'confirmed')::int as rsvp_count,
         st_x(e.approx_location::geometry) as approx_lng, st_y(e.approx_location::geometry) as approx_lat
  from events e where e.starts_at > now() - interval '3 hours';

-- address only for confirmed guests (or the host)
create or replace function meal_address(p_meal uuid) returns text language sql security definer stable as $$
  select m.address from meals m
  where m.id = p_meal
    and (m.host_id = auth.uid()
         or exists (select 1 from rsvps r where r.meal_id = m.id and r.user_id = auth.uid() and r.status = 'confirmed'))
$$;

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table meals enable row level security;
alter table events enable row level security;
alter table rsvps enable row level security;
alter table messages enable row level security;
alter table conversation_members enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
-- everyone else reads profiles ONLY through public_profiles (no direct select policy on the table)

create policy "meals: host manages"  on meals  for all using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "events: host manages" on events for all using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "rsvps: own"  on rsvps for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "rsvps: host sees" on rsvps for select using (
  exists (select 1 from meals m where m.id = rsvps.meal_id and m.host_id = auth.uid()) or
  exists (select 1 from events e where e.id = rsvps.event_id and e.host_id = auth.uid()));
create policy "messages: members" on messages for all using (
  exists (select 1 from conversation_members cm where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()));
create policy "members: self" on conversation_members for select using (user_id = auth.uid());
create policy "reports: file" on reports for insert with check (reporter_id = auth.uid());
create policy "blocks: own" on blocks for all using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select on public_profiles, public_meals, public_events, spots to anon, authenticated;
