/** Domain types for kAppit. Mirrors the Supabase schema in supabase/schema.sql. */

export type PersonType =
  | "new_arrival"
  | "friends"
  | "dating"
  | "cook"
  | "student"
  | "ate_kuya"
  | "free_now"
  | "konduktor";

export type EventKind = "birthday" | "karaoke" | "sports" | "gathering";

export interface Profile {
  id: string;
  display_name: string;
  photo_url: string | null;
  region_ph: string | null;        // "Iloilo", "Cebu" — where in the Philippines they're from
  bio: string | null;
  primary_type: PersonType;
  open_to_friends: boolean;
  open_to_dating: boolean;         // the heart badge is shown only to others who also opted in
  is_new_arrival: boolean;
  is_verified: boolean;
  is_visible: boolean;             // the map visibility toggle; default false
  /** Jittered coordinates only — the exact location never leaves the server. */
  approx_lng: number | null;
  approx_lat: number | null;
}

export interface Meal {
  id: string;
  host_id: string;
  host?: Profile;
  dish: string;
  note: string | null;
  starts_at: string;               // ISO
  seats_total: number;
  seats_taken: number;
  is_live: boolean;                // tonight
  approx_lng: number;
  approx_lat: number;
}

export interface Event {
  id: string;
  host_id: string;
  host?: Profile;
  title: string;
  kind: EventKind;
  description: string | null;
  starts_at: string;
  venue: string | null;
  open_to_everyone: boolean;
  rsvp_count: number;
  approx_lng: number;
  approx_lat: number;
}

export interface Spot {
  id: string;
  name: string;
  category: string;                // "grocery", "restaurant", "church"
  lng: number;                     // spots are businesses: exact is fine
  lat: number;
}

/** One thing on the map — what the pins and the handrail list render. */
export type MapItem =
  | { kind: "person"; id: string; lng: number; lat: number; data: Profile }
  | { kind: "meal"; id: string; lng: number; lat: number; data: Meal }
  | { kind: "event"; id: string; lng: number; lat: number; data: Event }
  | { kind: "spot"; id: string; lng: number; lat: number; data: Spot };
