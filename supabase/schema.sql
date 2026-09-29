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

-- ---------- events (food share is one category) ----------
create type event_category as enum ('food_share','birthday','karaoke','sports','church','outdoors','gathering');

create table events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references profiles(id) on delete cascade,
  category event_category not null default 'gathering',
  title text not null,                              -- for food_share: the dish
  description text,
  starts_at timestamptz not null,
  venue text,
  open_to_everyone boolean not null default true,
  seats_total int check (seats_total between 1 and 200),   -- null = unlimited
  exact_location geography(point, 4326) not null,   -- NEVER exposed
  approx_location geography(point, 4326) not null,
  address text,                                     -- released only to confirmed guests
  created_at timestamptz not null default now()
);

-- ---------- joining: sakay / sabit ----------
create type rsvp_status as enum ('pending','confirmed','declined','sabit');   -- sabit = waitlist

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  status rsvp_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ---------- businesses (public: exact is fine) ----------
create type business_category as enum ('restaurant','grocery','bakery','remittance','salon','other');

create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null,   -- claimed listings
  name text not null,
  category business_category not null default 'other',
  description text,
  address text,
  hours text,
  is_filipino_owned boolean not null default true,
  location geography(point, 4326) not null,
  created_at timestamptz not null default now()
);

-- ---------- feed ----------
create table posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null check (length(body) <= 2000),
  media jsonb not null default '[]',      -- [{type:'image'|'video', url, poster?, alt?}], max 4 images or 1 video; files in Supabase Storage bucket "posts"
  link jsonb,                             -- {url, title, description?, image?, site?} — fetched server-side (unfurl edge function)
  event_id uuid references events(id) on delete set null,
  business_id uuid references businesses(id) on delete set null,
  created_at timestamptz not null default now(),
  check (jsonb_array_length(media) <= 4)
);
create index posts_created_idx on posts (created_at desc);

create table post_kapits (               -- the "kapit" reaction on a post
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);
create table post_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null check (length(body) <= 1000),
  created_at timestamptz not null default now()
);

-- Storage: create a public bucket "posts" (images ≤10 MB, video ≤100 MB); RLS on storage.objects: insert where owner = auth.uid().

-- kapits: a confirmed connection between two people (the verb, as a table)
create table kapits (
  user_id uuid references profiles(id) on delete cascade,
  kapit_id uuid references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  primary key (user_id, kapit_id)
);

-- ---------- chat ----------
create table conversations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,   -- a thread spins up per event
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
create trigger events_approx   before insert or update of exact_location on events   for each row execute function set_approx();

-- ---------- what the client reads: views with NO exact columns ----------
create view public_profiles as
  select id, display_name, photo_url, region_ph, bio, primary_type, open_to_friends, open_to_dating,
         is_new_arrival, is_verified,
         st_x(approx_location::geometry) as approx_lng, st_y(approx_location::geometry) as approx_lat
  from profiles where is_visible;

create view public_events as
  select e.id, e.host_id, e.category, e.title, e.description, e.starts_at, e.venue, e.open_to_everyone, e.seats_total,
         (select count(*) from rsvps r where r.event_id = e.id and r.status = 'confirmed')::int as seats_taken,
         (e.starts_at::date = (now() at time zone 'utc')::date) as is_live,
         st_x(e.approx_location::geometry) as approx_lng, st_y(e.approx_location::geometry) as approx_lat
  from events e where e.starts_at > now() - interval '3 hours';

create view public_businesses as
  select id, name, category, description, address, hours, is_filipino_owned,
         st_x(location::geometry) as lng, st_y(location::geometry) as lat
  from businesses;

-- address only for confirmed guests (or the host)
create or replace function event_address(p_event uuid) returns text language sql security definer stable as $$
  select e.address from events e
  where e.id = p_event
    and (e.host_id = auth.uid()
         or exists (select 1 from rsvps r where r.event_id = e.id and r.user_id = auth.uid() and r.status = 'confirmed'))
$$;

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table events enable row level security;
alter table businesses enable row level security;
alter table posts enable row level security;
alter table kapits enable row level security;
alter table post_kapits enable row level security;
alter table post_replies enable row level security;
alter table rsvps enable row level security;
alter table messages enable row level security;
alter table conversation_members enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;

create policy "own profile" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
-- everyone else reads profiles ONLY through public_profiles (no direct select policy on the table)

create policy "events: host manages" on events for all using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy "businesses: read" on businesses for select using (true);
create policy "businesses: owner manages" on businesses for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "posts: read" on posts for select using (
  not exists (select 1 from blocks b where b.user_id = auth.uid() and b.blocked_user_id = posts.author_id));
create policy "posts: own" on posts for all using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "post_kapits: read" on post_kapits for select using (true);
create policy "post_kapits: own" on post_kapits for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "post_replies: read" on post_replies for select using (true);
create policy "post_replies: own" on post_replies for all using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "kapits: either side" on kapits for all using (user_id = auth.uid() or kapit_id = auth.uid()) with check (user_id = auth.uid());
create policy "rsvps: own"  on rsvps for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "rsvps: host sees" on rsvps for select using (
  exists (select 1 from events e where e.id = rsvps.event_id and e.host_id = auth.uid()));
create policy "messages: members" on messages for all using (
  exists (select 1 from conversation_members cm where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()));
create policy "members: self" on conversation_members for select using (user_id = auth.uid());
create policy "reports: file" on reports for insert with check (reporter_id = auth.uid());
create policy "blocks: own" on blocks for all using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select on public_profiles, public_events, public_businesses to anon, authenticated;
