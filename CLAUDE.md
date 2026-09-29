# kAppit — instructions for Claude Code

kAppit (always spelled exactly like that: lowercase k, capital A) is a map-first app for Filipinos anywhere in the world to find people, join events, and share food. Tagline: *Sakay na, kapit na.*

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
3. **Flan (`--flan`) means host/create.** The center + button, event pins, new-arrival badges, count chips.
4. **Marcellus is weight 400, headings only. Figtree for everything else.**
5. **English UI.** Filipino words are fixed brand vocabulary only: kAppit/kapit, Kap, Sakay na, Sabit, Konduktor, Tara na, "Kumusta, kababayan!", and the taglines. Never full Tagalog sentences. Nav is Map · Events · Host · Chats · You.
6. **Location privacy.** People, meals, and events render at jittered coordinates (200–400 m, stable per record — see `src/lib/geo.ts` and `jitter_point` in the schema). Exact coordinates never reach the client for people; addresses only after the host confirms a guest. The "open to dating" badge is shown only to viewers who also opted in.
7. **Kap** (the mascot, `public/brand/kap.png`) appears only in onboarding, empty states, and success moments. Never on the map, never a persistent helper.
8. **Responsive like Sniffies.** <768px: full-screen map, bottom nav, the ube handrail sheet. 768–1100: the sheet is a floating card. ≥1100: nav becomes a left rail, the sheet a permanent sidebar.

## Layout of the code

- `src/styles/` — tokens and global styles
- `src/components/` — MapView, Handrail (the sheet/sidebar), Nav, Shell, Icon (glyphs, Mark, Wordmark)
- `src/screens/` — Welcome (splash + onboarding + fourth-wall Kap), MapScreen (home), placeholders for the rest
- `src/lib/` — types, geo (jitter/distance), seed data, supabase client
- `supabase/schema.sql` — tables, jitter trigger, public views, RLS

## Working here

`npm run dev` for the app. `npm run build` must pass before committing. Keep commits small and named by screen or feature. When adding a screen, add its route in `src/App.tsx` and replace the Placeholder.

## What's next (in order)

1. Host a meal — the flan + flow: dish, time, seats, area. One-sentence feel.
2. Auth (Supabase: phone/Apple/Google) and profile setup with `region_ph` and the type picker.
3. Events feed + create event (separate, heavier flow than food share).
4. Chats with a per-meal thread.
5. Wire MapScreen to `public_profiles`/`public_meals`/`public_events` instead of seed.
6. Papunta — the ride layer: deep-link to Maps, the host's "who's on the way" strip, Kap greeting on arrival.
