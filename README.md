# kAppit

**Sakay na, kapit na.** A map-first app for Filipinos anywhere in the world to find people, join events, and share food.

Open the app and see who and what is near you tonight — kababayan open to connecting, hosted meals, gatherings, Filipino spots. Food is the front door.

## Run it

```bash
npm install
npm run dev
```

Runs on seed data out of the box. To connect a backend, create a Supabase project, run `supabase/schema.sql` in its SQL editor, copy `.env.example` to `.env.local`, and fill in the URL and anon key.

## Stack

Vite · React · TypeScript · MapLibre (OpenFreeMap tiles) · Supabase · Router

## Design

The brand and design system live in the **kAppit Design System** artifact on claude.ai. `src/styles/tokens.css` mirrors it. See `CLAUDE.md` for the rules every contributor (human or Claude) follows.

## Privacy

People, meals, and events are placed at approximate, jittered locations — never exact. Addresses are shared only after a host confirms a guest. The "open to dating" badge is visible only to people who also opted in. Report and block are reachable everywhere.
