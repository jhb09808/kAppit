import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import Handrail from "../components/Handrail";
import { Icon, Wordmark } from "../components/Icon";
import { HOME, seedItems } from "../lib/seed";
import type { MapItem } from "../lib/types";
import { useSettings } from "../lib/settings";
import { useLocation } from "../lib/useLocation";
import "./MapScreen.css";

type Filter = "all" | "people" | "events" | "food" | "businesses" | "new" | "near";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" }, { id: "people", label: "People" }, { id: "events", label: "Events" },
  { id: "food", label: "Food share" }, { id: "businesses", label: "Businesses" }, { id: "new", label: "New arrivals" }, { id: "near", label: "Within 1 mi" },
];

export default function MapScreen() {
  const nav = useNavigate();
  const { settings, update } = useSettings();
  const { me, status: locStatus, request: requestLocation } = useLocation();
  const center: [number, number] = me ? [me.lng, me.lat] : HOME;
  const [items] = useState<MapItem[]>(() => seedItems());
  const [filters, setFilters] = useState<Set<Filter>>(new Set(["all"]));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const toggle = (f: Filter) => setFilters((s) => {
    const n = new Set(s);
    if (f === "all") return new Set<Filter>(["all"]);
    n.delete("all"); n.has(f) ? n.delete(f) : n.add(f);
    return n.size ? n : new Set<Filter>(["all"]);
  });

  const shown = useMemo(() => items.filter((it) => {
    if (filters.has("all")) return true;
    const kinds = ["people", "events", "food", "businesses", "new"].some((k) => filters.has(k as Filter));
    if (!kinds) return true;
    return (filters.has("people") && it.kind === "person")
      || (filters.has("events") && it.kind === "event")
      || (filters.has("food") && it.kind === "event" && it.data.category === "food_share")
      || (filters.has("businesses") && it.kind === "business")
      || (filters.has("new") && it.kind === "person" && it.data.is_new_arrival);
  }), [items, filters]);

  const onSelect = useCallback((id: string | null) => setSelectedId(id), []);

  return (
    <div className="mapscreen">
      <Handrail items={shown} center={center} selectedId={selectedId} open={open} onOpenChange={setOpen} onSelect={onSelect} />
      <main className="mapmain">
        <MapView items={shown} center={HOME} me={me} selectedId={selectedId} viewerOptedIntoDating={settings.openToDating} onSelect={(id) => { setSelectedId(id); setOpen(true); }} onRequestLocation={requestLocation} />

        {locStatus !== "granted" && (
          <div className={`locbar ${locStatus}`}>
            {locStatus === "idle" && <><span>See what's near <b>you</b>, not the default spot.</span><button className="btn btn-primary btn-sm" onClick={requestLocation}>Use my location</button></>}
            {locStatus === "asking" && <span>Asking your phone for location…</span>}
            {locStatus === "denied" && <span>Location is off for this site. Turn it on in your browser settings, then reload.</span>}
            {locStatus === "insecure" && <span>Location needs HTTPS. Open the <b>https://</b> address from the dev server (or the deployed site).</span>}
            {locStatus === "unsupported" && <span>This browser can't share location.</span>}
            {locStatus === "error" && <><span>Couldn't get a fix.</span><button className="btn btn-outline btn-sm" onClick={requestLocation}>Try again</button></>}
          </div>
        )}

        <div className="top">
          <div className="searchrow">
            <div className="brand"><Wordmark size={18} /></div>
            <div className="search"><Icon name="search" size={17} stroke={1.9} /><input placeholder="Search people, events, businesses…" aria-label="Search" /></div>
            <button className="settingsbtn" aria-label="Settings" onClick={() => nav("/settings")}>
              <Icon name="settings" size={20} stroke={1.8} />
              <i className={`dot${settings.visible ? " on" : ""}`} title={settings.visible ? "You're visible" : "You're hidden"} />
            </button>
          </div>
          <div className="chips">
            {FILTERS.map((f) => <button key={f.id} className={`chip${filters.has(f.id) ? " on" : ""}`} onClick={() => toggle(f.id)}>{f.label}</button>)}
          </div>
        </div>

        {!settings.askedVisibility && (
          <div className="visprompt">
            <div className="t-card">Want kababayan nearby to see you on the map?</div>
            <p className="t-caption">Only your general area is ever shown — never your exact location. You can change this anytime in Settings.</p>
            <div className="row">
              <button className="btn btn-primary" onClick={() => update({ visible: true, askedVisibility: true })}>Yes, show me</button>
              <button className="btn btn-ghost" onClick={() => update({ askedVisibility: true })}>Not now</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
