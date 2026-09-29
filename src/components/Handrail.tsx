import { useMemo, useState } from "react";
import type { MapItem } from "../lib/types";
import { milesBetween } from "../lib/geo";
import { BUSINESS_CATEGORY_LABEL, EVENT_CATEGORY_LABEL, GLYPH, Icon, PERSON_TYPE_LABEL } from "./Icon";
import "./Handrail.css";

interface Props {
  items: MapItem[];
  center: [number, number];
  selectedId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string | null) => void;
}

const when = (iso: string) => `${new Date(iso).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;

export function title(it: MapItem) {
  return it.kind === "person" ? it.data.display_name : it.kind === "event" ? it.data.title : it.data.name;
}
export function subtitle(it: MapItem) {
  if (it.kind === "person") return [PERSON_TYPE_LABEL[it.data.primary_type], it.data.region_ph].filter(Boolean).join(" · ");
  if (it.kind === "event") {
    const e = it.data;
    const seats = e.seats_total != null ? `${e.seats_total - e.seats_taken} of ${e.seats_total} seats left` : `${e.seats_taken} going`;
    return `${EVENT_CATEGORY_LABEL[e.category]} · ${e.is_live ? "Tonight" : when(e.starts_at)} · ${seats}`;
  }
  return `${BUSINESS_CATEGORY_LABEL[it.data.category]}${it.data.hours ? ` · ${it.data.hours}` : ""}`;
}
export function glyph(it: MapItem) {
  return it.kind === "person" ? GLYPH[it.data.primary_type] : it.kind === "event" ? GLYPH[it.data.category] : GLYPH[it.data.category];
}
export function thumbClass(it: MapItem) {
  return it.kind === "person" ? "person" : it.kind === "event" ? (it.data.category === "food_share" ? "food" : "event") : "business";
}

export default function Handrail({ items, center, selectedId, open, onOpenChange, onSelect }: Props) {
  const [y0, setY0] = useState<number | null>(null);
  const c = { lng: center[0], lat: center[1] };
  const sorted = useMemo(() => [...items].sort((a, b) => milesBetween(a, c) - milesBetween(b, c)), [items, center]); // eslint-disable-line react-hooks/exhaustive-deps
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const seats = selected?.kind === "event" && selected.data.seats_total != null ? { total: selected.data.seats_total, taken: selected.data.seats_taken } : null;
  const full = seats ? seats.taken >= seats.total : false;

  const thumb = (it: MapItem) => (
    <div className={`thumb ${thumbClass(it)}`} dangerouslySetInnerHTML={it.kind === "person" ? { __html: it.data.display_name.slice(0, 2).toUpperCase() } : { __html: `<svg viewBox="0 0 24 24">${glyph(it)}</svg>` }} />
  );

  return (
    <aside className={`handrail${open ? " open" : ""}${selected ? " detail" : ""}`}>
      <div className="grip" onClick={() => (selected ? onSelect(null) : onOpenChange(!open))}
        onTouchStart={(e) => setY0(e.touches[0].clientY)}
        onTouchEnd={(e) => { if (y0 === null) return; const dy = e.changedTouches[0].clientY - y0; if (dy < -30) onOpenChange(true); if (dy > 30) { onOpenChange(false); onSelect(null); } setY0(null); }}>
        <i />
      </div>
      <div className="phead" onClick={() => onOpenChange(!open)}>
        <h3>See who's near you tonight</h3>
        <span className="cnt">{items.length}</span>
        <Icon name="chevron" className="chev" size={18} />
      </div>

      <div className="pbody">
        {!selected && (
          <div className="list">
            {sorted.map((it) => (
              <div key={it.id} className="row" onClick={() => onSelect(it.id)}>
                {thumb(it)}
                <div className="rinfo">
                  <div className="t">{title(it)}{it.kind === "event" && it.data.is_live && <span className="badge badge-live"><i />Live</span>}</div>
                  <div className="s">{subtitle(it)}</div>
                </div>
                <span className="dist">{milesBetween(it, c).toFixed(1)} mi</span>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="detailview">
            <button className="back" onClick={() => onSelect(null)}>← See who's near you tonight</button>
            <div className="dhead">
              {thumb(selected)}
              <div>
                <h3 className="t-card">{title(selected)}</h3>
                <div className="t-caption">{subtitle(selected)} · {milesBetween(selected, c).toFixed(1)} mi</div>
              </div>
            </div>
            <p className="dbody">{selected.kind === "person" ? selected.data.bio : selected.data.description}</p>

            {selected.kind === "event" && selected.data.host && (
              <div className="hostrow">
                <div className="av">{selected.data.host.display_name.slice(0, 2).toUpperCase()}</div>
                <div className="hn">Konduktor: {selected.data.host.display_name}<small>{selected.data.host.is_verified ? "Verified · " : ""}{selected.data.host.region_ph}</small></div>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }}>Message</button>
              </div>
            )}
            {selected.kind === "business" && (
              <div className="hostrow">
                <div className="hn">{selected.data.address}<small>{selected.data.is_filipino_owned ? "Filipino-owned" : ""}</small></div>
              </div>
            )}
            {seats && (
              <div className="seats">{Array.from({ length: seats.total }, (_, k) => <i key={k} className={k < seats.taken ? "taken" : ""} />)}<span>{full ? "It's full" : `${seats.total - seats.taken} of ${seats.total} seats left`}</span></div>
            )}

            {selected.kind === "event" && (full
              ? <button className="btn btn-outline btn-block">Join the sabit list</button>
              : <button className="btn btn-sakay btn-block">Sakay na{seats ? ` — ${seats.total - seats.taken} seats left` : ""}</button>)}
            {selected.kind === "person" && <button className="btn btn-primary btn-block">Kapit {selected.data.display_name.split(" ")[0]}</button>}
            {selected.kind === "business" && <button className="btn btn-primary btn-block">Get directions</button>}

            <p className="safety">{selected.kind === "person" ? "Only their general area is shown — never an exact location." : selected.kind === "event" ? <>Exact address is shared once the host confirms you. <b>Verified</b> hosts have ID on file.</> : "Public business — exact address shown."}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
