# kAppit — instructions for Claude Code

kAppit (always spelled exactly like that: lowercase k, capital A) is a map-first app for Filipinos anywhere in the world. Three function groups: **People** (meet, kapit, chat), **Events** (many categories — food share is one), and **Businesses** (Filipino restaurants, stores, supermarkets). Plus a **Feed**. Tagline: *Sakay na, kapit na.*

## Read this first

The single source of truth for brand, tokens, components, copy rules, and the map spec is the **kAppit Design System** artifact on claude.ai (a Design System artifact titled "kAppit"). Read its `project/README.md` before building or restyling any screen. `src/styles/tokens.css` mirrors its tokens — if they ever disagree, the artifact wins; update the CSS.

## Stack

- Vite + React 19 + TypeScript. React Router for screens.
- MapLibre GL with OpenFreeMap tiles (no key), recolored to the palette in `src/components/MapView.tsx`.
- Supabase for auth, Postgres + PostGIS, realtime, storage. Schema in `supabase/schema.sql`. The client runs on seed data (`src/lib/seed.ts`) until `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set in `.env.local`.
- Deploy target: Vercel or Cloudflare Pages from `main`.

## Rules that are not negotiable

1. **Never hardcode a hex.** Use the CSS variables in `src/styles/tokens.css`.
2. **Vermilion (`--verm`) means live only.** Food-share pins, pulsing rings, the Sakay na button. Nothing else is red.
3. **Flan (`--flan`) means host/create.** The Host button, non-food event pins, new-arrival badges, count chips.
4. **Marcellus is weight 400, headings only. Figtree for everything else.**
5. **English UI.** Filipino words are fixed brand vocabulary only: kAppit/kapit, Kap, Sakay na, Sabit, Konduktor, Tara na, "Kumusta, kababayan!", and the taglines. Never full Tagalog sentences. Nav is **Map · Events · Feed · Chats · Profile.** Settings lives behind the gear button beside the map search (visibility, open-to-friends/dating, privacy, blocked people, premium, legal, account).
6. **Location privacy.** People, meals, and events render at jittered coordinates (200–400 m, stable per record — see `src/lib/geo.ts` and `jitter_point` in the schema). Exact coordinates never reach the client for people; addresses only after the host confirms a guest. The "open to dating" badge is shown only to viewers who also opted in.
7. **Kap** (the mascot, `public/brand/kap.png`) appears only in onboarding, empty states, and success moments. Never on the map, never a persistent helper.
8. **Responsive like Sniffies.** <768px: full-screen map, bottom nav, the ube handrail sheet. 768–1100: the sheet is a floating card. ≥1100: nav becomes a left rail, the sheet a permanent sidebar.

## Layout of the code

- `src/styles/` — tokens and global styles
- `src/components/` — MapView, Handrail (the sheet/sidebar), Nav, Shell, Icon (glyphs, Mark, Wordmark)
- `src/screens/` — Welcome (splash + onboarding + fourth-wall Kap), MapScreen (home), Events (categories + Host sheet), Feed (My kapits / Everyone nearby; posts carry text, up to 4 photos or 1 video, an external link preview, an event, or a business), Settings, placeholders for Chats and Profile
- `src/lib/` — types, geo (jitter/distance), seed data, settings store (device-local until auth), supabase client
- `supabase/schema.sql` — tables, jitter trigger, public views, RLS

## Working here

`npm run dev` for the app. `npm run build` must pass before committing. Keep commits small and named by screen or feature. When adding a screen, add its route in `src/App.tsx` and replace the Placeholder.

## Map pins

People = photo (or initials) in an ube ring with a type badge. Events: food share is `--verm` (pulses when today), every other category is `--flan`. Businesses are `--leaf`. Below zoom 13 everything collapses to dots.

## What's next (in order)

1. Create-event flows: food share (dish, time, seats, area — one-sentence feel) and the fuller event form for other categories.
2. Auth (Supabase: phone/Apple/Google) and Profile with `region_ph`, photo, type picker; move the settings store to the profile row.
3. Chats with a per-event thread.
4. Feed uploads: Supabase Storage bucket "posts" for photos/video, and an `unfurl` edge function that fetches OpenGraph data for external links (never trust client-supplied previews).
5. Business pages (claimable listings) and business search.
6. Wire Map/Events/Feed to `public_profiles` / `public_events` / `public_businesses` / `posts` instead of seed.
7. Papunta — the ride layer: deep-link to Maps, the host's "who's on the way" strip, Kap greeting on arrival.
