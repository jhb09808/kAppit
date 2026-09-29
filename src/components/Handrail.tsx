import { useMemo, useState } from "react";
import type { MapItem } from "../lib/types";
import { milesBetween } from "../lib/geo";
import { GLYPH, Icon, PERSON_TYPE_LABEL } from "./Icon";
import "./Handrail.css";

interface Props {
  items: MapItem[];
  center: [number, number];
  selectedId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string | null) => void;
}

function title(it: MapItem) {
  return it.kind === "person" ? it.data.display_name : it.kind === "meal" ? it.data.dish : it.kind === "event" ? it.data.title : it.data.name;
}
function subtitle(it: MapItem) {
  if (it.kind === "person") return [PERSON_TYPE_LABEL[it.data.primary_type], it.data.region_ph].filter(Boolean).join(" · ");
  if (it.kind === "meal") return `${it.data.is_live ? "Tonight" : new Date(it.data.starts_at).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(it.data.starts_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · ${it.data.seats_total - it.data.seats_taken} of ${it.data.seats_total} seats left`;
  if (it.kind === "event") return `${new Date(it.data.starts_at).toLocaleDateString(undefined, { weekday: "short" })} ${new Date(it.data.starts_at).toLocaleTimeString(undefined, { hour: "numeric" })} · ${it.data.rsvp_count} going`;
  return `Filipino ${it.data.category}`;
}
function glyph(it: MapItem) {
  return it.kind === "person" ? GLYPH[it.data.primary_type] : it.kind === "meal" ? GLYPH.meal : it.kind === "event" ? GLYPH[it.data.kind] : GLYPH.spot;
}

export default function Handrail({ items, center, selectedId, open, onOpenChange, onSelect }: Props) {
  const [y0, setY0] = useState<number | null>(null);
  const sorted = useMemo(() => [...items].sort((a, b) => milesBetween(a, { lng: center[0], lat: center[1] }) - milesBetween(b, { lng: center[0], lat: center[1] })), [items, center]);
  const selected = items.find((i) => i.id === selectedId) ?? null;

  const isPerson = selected?.kind === "person";
  const seats = selected?.kind === "meal" ? { total: selected.data.seats_total, taken: selected.data.seats_taken } : null;
  const full = seats ? seats.taken >= seats.total : false;

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
                <div className={`thumb ${it.kind}`} dangerouslySetInnerHTML={it.kind === "person" ? { __html: it.data.display_name.slice(0, 2).toUpperCase() } : { __html: `<svg viewBox="0 0 24 24">${glyph(it)}</svg>` }} />
                <div className="rinfo">
                  <div className="t">{title(it)}{it.kind === "meal" && it.data.is_live && <span className="badge badge-live"><i />Live</span>}</div>
                  <div className="s">{subtitle(it)}</div>
                </div>
                <span className="dist">{milesBetween(it, { lng: center[0], lat: center[1] }).toFixed(1)} mi</span>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="detailview">
            <button className="back" onClick={() => onSelect(null)}>← See who's near you tonight</button>
            <div className="dhead">
              <div className={`thumb ${selected.kind}`} dangerouslySetInnerHTML={selected.kind === "person" ? { __html: selected.data.display_name.slice(0, 2).toUpperCase() } : { __html: `<svg viewBox="0 0 24 24">${glyph(selected)}</svg>` }} />
              <div>
                <h3 className="t-card">{title(selected)}</h3>
                <div className="t-caption">{subtitle(selected)} · {milesBetween(selected, { lng: center[0], lat: center[1] }).toFixed(1)} mi</div>
              </div>
            </div>
            <p className="dbody">{selected.kind === "person" ? selected.data.bio : selected.kind === "meal" ? selected.data.note : selected.kind === "event" ? selected.data.description : "A Filipino spot. Low-pressure place for a first meet-up."}</p>
            {(selected.kind === "meal" || selected.kind === "event") && selected.data.host && (
              <div className="hostrow">
                <div className="av">{selected.data.host.display_name.slice(0, 2).toUpperCase()}</div>
                <div className="hn">Konduktor: {selected.data.host.display_name}<small>{selected.data.host.is_verified ? "Verified · " : ""}{selected.data.host.region_ph}</small></div>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: "auto" }}>Message</button>
              </div>
            )}
            {seats && (
              <div className="seats">{Array.from({ length: seats.total }, (_, k) => <i key={k} className={k < seats.taken ? "taken" : ""} />)}<span>{full ? "It's full" : `${seats.total - seats.taken} of ${seats.total} seats left`}</span></div>
            )}
            {selected.kind === "meal" && (full
              ? <button className="btn btn-outline btn-block">Join the sabit list</button>
              : <button className="btn btn-sakay btn-block">Sakay na — {seats!.total - seats!.taken} seats left</button>)}
            {selected.kind === "event" && <button className="btn btn-sakay btn-block">Sakay na</button>}
            {isPerson && <button className="btn btn-primary btn-block">Kapit {selected.data.display_name.split(" ")[0]}</button>}
            {selected.kind === "spot" && <button className="btn btn-primary btn-block">See details</button>}
            <p className="safety">{isPerson || selected.kind === "spot" ? "Only their general area is shown — never an exact location." : <>Exact address is shared once the host confirms you. <b>Verified</b> hosts have ID on file.</>}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
