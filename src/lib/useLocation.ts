import { useCallback, useEffect, useRef, useState } from "react";

export type LocationStatus = "idle" | "asking" | "granted" | "denied" | "unsupported" | "insecure" | "error";

export interface Located { lng: number; lat: number; accuracy: number }

const KEY = "kappit.location.granted";

/**
 * The viewer's own location. Asks once, then watches for updates.
 * - Never asks automatically on first visit; the screen shows a prompt and calls request().
 * - Remembers a grant so later visits ask the browser silently.
 * - Safari/Chrome refuse geolocation on http:// (except localhost) — surfaces that as "insecure".
 */
export function useLocation() {
  const [status, setStatus] = useState<LocationStatus>(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return "unsupported";
    if (!window.isSecureContext) return "insecure";
    return "idle";
  });
  const [me, setMe] = useState<Located | null>(null);
  const watch = useRef<number | null>(null);

  const onFix = (p: GeolocationPosition) => {
    setMe({ lng: p.coords.longitude, lat: p.coords.latitude, accuracy: p.coords.accuracy });
    setStatus("granted");
    try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ }
  };
  const onErr = (e: GeolocationPositionError) => {
    setStatus(e.code === e.PERMISSION_DENIED ? "denied" : "error");
  };

  const request = useCallback(() => {
    if (status === "unsupported" || status === "insecure") return;
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(onFix, onErr, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
    if (watch.current == null) {
      watch.current = navigator.geolocation.watchPosition(onFix, () => {}, { enableHighAccuracy: true, maximumAge: 15000 });
    }
  }, [status]);

  // previously granted → ask silently on load
  useEffect(() => {
    let granted = false;
    try { granted = localStorage.getItem(KEY) === "1"; } catch { /* ignore */ }
    if (granted && status === "idle") request();
    return () => { if (watch.current != null) navigator.geolocation.clearWatch(watch.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { me, status, request };
}
