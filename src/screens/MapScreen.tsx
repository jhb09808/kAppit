import { useCallback, useMemo, useState } from "react";
import MapView from "../components/MapView";
import Handrail from "../components/Handrail";
import { Icon, Wordmark } from "../components/Icon";
import { HOME, seedItems } from "../lib/seed";
import type { MapItem } from "../lib/types";
import "./MapScreen.css";

type Filter = "all" | "people" | "events" | "food" | "new" | "near";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" }, { id: "people", label: "People" }, { id: "events", label: "Events" },
  { id: "food", label: "Food share" }, { id: "new", label: "New arrivals" }, { id: "near", label: "Within 1 mi" },
];

export default function MapScreen() {
  const [items] = useState<MapItem[]>(() => seedItems());
  const [filters, setFilters] = useState<Set<Filter>>(new Set(["all"]));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);       // the viewer's own visibility on the map
  const [askedVisibility, setAskedVisibility] = useState(false);
  const viewerOptedIntoDating = false;                  // from the viewer's profile once auth exists

  const toggle = (f: Filter) => setFilters((s) => {
    const n = new Set(s);
    if (f === "all") return new Set<Filter>(["all"]);
    n.delete("all"); n.has(f) ? n.delete(f) : n.add(f);
    return n.size ? n : new Set<Filter>(["all"]);
  });

  const shown = useMemo(() => items.filter((it) => {
    if (filters.has("all")) return true;
    const okKind = (filters.has("people") && it.kind === "person") || (filters.has("events") && it.kind === "event") || (filters.has("food") && it.kind === "meal");
    const okNew = filters.has("new") && it.kind === "person" && it.data.is_new_arrival;
    const wantsKind = filters.has("people") || filters.has("events") || filters.has("food") || filters.has("new");
    return (!wantsKind || okKind || okNew);
  }), [items, filters]);

  const onSelect = useCallback((id: string | null) => setSelectedId(id), []);

  return (
    <div className="mapscreen">
      <Handrail items={shown} center={HOME} selectedId={selectedId} open={open} onOpenChange={setOpen} onSelect={onSelect} />
      <main className="mapmain">
        <MapView items={shown} center={HOME} selectedId={selectedId} viewerOptedIntoDating={viewerOptedIntoDating} onSelect={(id) => { setSelectedId(id); setOpen(true); }} />

        <div className="top">
          <div className="searchrow">
            <div className="brand"><Wordmark size={18} /></div>
            <div className="search"><Icon name="search" size={17} stroke={1.9} /><input placeholder="Search people, events, food…" aria-label="Search" /></div>
            <button className={`vis${visible ? "" : " hidden"}`} aria-label={visible ? "You're visible on the map" : "You're hidden"} onClick={() => setVisible((v) => !v)}>
              JT<span>{visible ? "Visible" : "Hidden"}</span>
            </button>
          </div>
          <div className="chips">
            {FILTERS.map((f) => <button key={f.id} className={`chip${filters.has(f.id) ? " on" : ""}`} onClick={() => toggle(f.id)}>{f.label}</button>)}
          </div>
        </div>

        {!askedVisibility && (
          <div className="visprompt">
            <div className="t-card">Want kababayan nearby to see you on the map?</div>
            <p className="t-caption">Only your general area is ever shown — never your exact location. You can change this anytime.</p>
            <div className="row">
              <button className="btn btn-primary" onClick={() => { setVisible(true); setAskedVisibility(true); }}>Yes, show me</button>
              <button className="btn btn-ghost" onClick={() => setAskedVisibility(true)}>Not now</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
