/** Domain types for kAppit. Mirrors the Supabase schema in supabase/schema.sql.
 *
 *  Three function groups: PEOPLE · EVENTS (many categories, food share is one) · BUSINESSES.
 */

export type PersonType =
  | "new_arrival"
  | "friends"
  | "dating"
  | "cook"
  | "student"
  | "ate_kuya"
  | "free_now"
  | "konduktor";

/** Event categories. food_share is the casual one: "I'm making sinigang for 4, come through." */
export type EventCategory =
  | "food_share"
  | "birthday"
  | "karaoke"
  | "sports"
  | "church"
  | "outdoors"
  | "gathering";

export type BusinessCategory = "restaurant" | "grocery" | "bakery" | "remittance" | "salon" | "other";

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
  is_visible: boolean;             // map visibility; default false
  /** Jittered coordinates only — the exact location never leaves the server. */
  approx_lng: number | null;
  approx_lat: number | null;
}

export interface Event {
  id: string;
  host_id: string;
  host?: Profile;
  category: EventCategory;
  title: string;                   // for food_share this is the dish
  description: string | null;
  starts_at: string;               // ISO
  venue: string | null;
  open_to_everyone: boolean;
  seats_total: number | null;      // food_share and small gatherings; null = unlimited
  seats_taken: number;
  is_live: boolean;                // today
  approx_lng: number;
  approx_lat: number;
}

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string | null;
  address: string | null;
  hours: string | null;
  is_filipino_owned: boolean;
  lng: number;                     // businesses are public: exact is fine
  lat: number;
}

/** A post on the feed: text, up to 4 photos or 1 video, an external link, an event or a business. */
export interface PostMedia {
  type: "image" | "video";
  url: string;
  poster?: string;                 // video thumbnail
  alt?: string;
}
export interface LinkPreview {
  url: string;
  title: string;
  description?: string;
  image?: string;
  site?: string;                   // "youtube.com"
}
export interface Post {
  id: string;
  author_id: string;
  author?: Profile;
  body: string;
  media: PostMedia[];
  link: LinkPreview | null;
  event_id: string | null;         // a post can be about an event
  business_id: string | null;      // or a business
  kapit_count: number;
  reply_count: number;
  created_at: string;
}

/** One thing on the map — what the pins and the handrail list render. */
export type MapItem =
  | { kind: "person"; id: string; lng: number; lat: number; data: Profile }
  | { kind: "event"; id: string; lng: number; lat: number; data: Event }
  | { kind: "business"; id: string; lng: number; lat: number; data: Business };
