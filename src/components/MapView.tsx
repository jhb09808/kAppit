import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapItem } from "../lib/types";
import { GLYPH } from "./Icon";
import "./MapView.css";

/** Brand palette applied to OpenFreeMap's positron tiles — land is abaca, roads linen. */
const P = { land: "#f5f0e3", land2: "#ece4d2", water: "#d9d2ea", park: "#dfe9d3", road: "#fdfbf4", major: "#fbf6ea", edge: "#ddd4c2", building: "#e8dfcf", label: "#665e75", halo: "#f5f0e3", boundary: "#c9bfd8" };

function recolor(map: maplibregl.Map) {
  for (const l of map.getStyle().layers) {
    const id = l.id.toLowerCase();
    const set = (p: string, v: unknown) => { try { (map as unknown as { setPaintProperty: (id: string, p: string, v: unknown) => void }).setPaintProperty(l.id, p, v); } catch { /* layer lacks this prop */ } };
    if (l.type === "background") set("background-color", P.land);
    else if (id.includes("water") && l.type === "fill") set("fill-color", P.water);
    else if (id.includes("water") && l.type === "line") set("line-color", P.water);
    else if (/park|green|wood|grass|forest|cemetery|golf|pitch|garden/.test(id) && l.type === "fill") set("fill-color", P.park);
    else if (/landuse|landcover|residential|industrial|commercial|school|hospital|retail/.test(id) && l.type === "fill") set("fill-color", P.land2);
    else if (id.includes("building") && l.type === "fill") { set("fill-color", P.building); set("fill-opacity", 0.45); }
    else if (/motorway|trunk|primary|highway/.test(id) && l.type === "line") set("line-color", id.includes("casing") ? P.edge : P.major);
    else if (/road|street|minor|service|path|tunnel|bridge|railway|transit|aeroway/.test(id) && l.type === "line") set("line-color", id.includes("casing") ? P.edge : P.road);
    else if (/boundary|admin/.test(id) && l.type === "line") set("line-color", P.boundary);
    else if (l.type === "symbol") { set("text-color", P.label); set("text-halo-color", P.halo); set("text-halo-width", 1.2); }
  }
}

function pinElement(item: MapItem, viewerOptedIntoDating: boolean): HTMLDivElement {
  const el = document.createElement("div");
  if (item.kind === "person") {
    const p = item.data;
    // the dating heart is visible only to viewers who also opted in; otherwise they read as a friends pin
    const type = p.primary_type === "dating" && !viewerOptedIntoDating ? "friends" : p.primary_type;
    el.className = `pin person${p.primary_type === "free_now" ? " live" : ""}`;
    const initials = p.display_name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
    el.innerHTML = `${p.photo_url ? "" : initials}<span class="ty"><svg viewBox="0 0 24 24">${GLYPH[type]}</svg></span>${p.is_verified ? `<span class="ver"><svg viewBox="0 0 24 24">${GLYPH.check}</svg></span>` : ""}`;
    if (p.photo_url) el.style.backgroundImage = `url(${p.photo_url})`;
    else el.style.backgroundColor = ["#c98b6b", "#8a5a44", "#d9a37a", "#a8785a", "#7a5340"][p.id.charCodeAt(p.id.length - 1) % 5];
  } else if (item.kind === "event") {
    const food = item.data.category === "food_share";
    el.className = `pin ${food ? "food" : "event"}${item.data.is_live ? " live" : ""}`;
    el.innerHTML = `<svg viewBox="0 0 24 24">${GLYPH[item.data.category]}</svg>`;
  } else {
    el.className = "pin business";
    el.innerHTML = `<svg viewBox="0 0 24 24">${GLYPH[item.data.category]}</svg>`;
  }
  return el;
}

interface Props {
  items: MapItem[];
  center: [number, number];
  selectedId: string | null;
  viewerOptedIntoDating: boolean;
  onSelect: (id: string) => void;
  onMoveEnd?: (bounds: maplibregl.LngLatBounds) => void;
}

export default function MapView({ items, center, selectedId, viewerOptedIntoDating, onSelect, onMoveEnd }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = new maplibregl.Map({
      container: el.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center, zoom: 12.6,
      attributionControl: { compact: true },
    });
    m.on("style.load", () => recolor(m));
    m.on("moveend", () => onMoveEnd?.(m.getBounds()));
    const me = document.createElement("div"); me.className = "me";
    new maplibregl.Marker({ element: me }).setLngLat(center).addTo(m);
    map.current = m;
    return () => { m.remove(); map.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync markers with items
  useEffect(() => {
    const m = map.current; if (!m) return;
    const seen = new Set<string>();
    for (const it of items) {
      seen.add(it.id);
      if (markers.current.has(it.id)) continue;
      const pin = pinElement(it, viewerOptedIntoDating);
      pin.addEventListener("click", (e) => { e.stopPropagation(); onSelect(it.id); });
      markers.current.set(it.id, new maplibregl.Marker({ element: pin }).setLngLat([it.lng, it.lat]).addTo(m));
    }
    for (const [id, mk] of markers.current) if (!seen.has(id)) { mk.remove(); markers.current.delete(id); }
  }, [items, viewerOptedIntoDating, onSelect]);

  // selection + zoom-level collapse
  useEffect(() => {
    for (const [id, mk] of markers.current) mk.getElement().classList.toggle("sel", id === selectedId);
  }, [selectedId]);

  useEffect(() => {
    const m = map.current; if (!m) return;
    const apply = () => { const dots = m.getZoom() < 13; for (const mk of markers.current.values()) mk.getElement().classList.toggle("dot", dots); };
    m.on("zoom", apply); apply();
    return () => { m.off("zoom", apply); };
  }, [items]);

  return (
    <div className="mapwrap">
      <div ref={el} className="map" />
      <button className="recenter" aria-label="Recenter" onClick={() => map.current?.flyTo({ center, zoom: 13.2 })}>
        <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: GLYPH.recenter }} />
      </button>
    </div>
  );
}
