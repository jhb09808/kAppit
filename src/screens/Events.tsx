import { useMemo, useState } from "react";
import { EVENT_CATEGORY_LABEL, Icon } from "../components/Icon";
import { events } from "../lib/seed";
import type { EventCategory } from "../lib/types";
import "./Events.css";

const CATS: (EventCategory | "all")[] = ["all", "food_share", "birthday", "karaoke", "sports", "church", "outdoors", "gathering"];
const when = (iso: string) => `${new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · ${new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;

export default function Events() {
  const [cat, setCat] = useState<EventCategory | "all">("all");
  const [hosting, setHosting] = useState(false);
  const list = useMemo(() => events.filter((e) => cat === "all" || e.category === cat).sort((a, b) => a.starts_at.localeCompare(b.starts_at)), [cat]);

  return (
    <div className="events">
      <header className="ehead">
        <h1 className="t-title">Events</h1>
        <button className="btn btn-host btn-sm" onClick={() => setHosting(true)}><Icon name="plus" size={16} stroke={2.4} />Host</button>
      </header>
      <div className="chips cats">
        {CATS.map((c) => <button key={c} className={`chip${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>{c === "all" ? "All" : EVENT_CATEGORY_LABEL[c]}</button>)}
      </div>

      <div className="elist">
        {list.map((e) => {
          const food = e.category === "food_share";
          const seats = e.seats_total != null ? `${e.seats_total - e.seats_taken} of ${e.seats_total} seats left` : `${e.seats_taken} going`;
          const host = e.host_id;
          return (
            <article key={e.id} className="ecard">
              <div className={`ebn ${food ? "food" : ""}`}>
                <span className="ecat"><Icon name={e.category} size={13} />{EVENT_CATEGORY_LABEL[e.category]}</span>
                {e.is_live && <span className="badge badge-live"><i />Live</span>}
              </div>
              <div className="ebd">
                <div className="t-card">{e.title}</div>
                <div className="t-caption">{when(e.starts_at)}{e.venue ? ` · ${e.venue}` : ""}</div>
                <p className="edesc">{e.description}</p>
                <div className="efoot">
                  <span className="eseats">{seats}</span>
                  <button className={`btn btn-sm ${food ? "btn-sakay" : "btn-primary"}`}>Sakay na</button>
                </div>
                <div className="ehost">Konduktor · {host}</div>
              </div>
            </article>
          );
        })}
        {!list.length && <div className="empty"><div className="t-card">Quiet in this category.</div><p className="t-caption">Be the first — host one.</p></div>}
      </div>

      {hosting && (
        <div className="sheetwrap" onClick={() => setHosting(false)}>
          <div className="hostsheet" onClick={(e) => e.stopPropagation()}>
            <div className="grip"><i /></div>
            <h2 className="t-card">What are you hosting?</h2>
            <p className="t-caption">Food share is the quick one — a dish, a time, a few seats.</p>
            <div className="hostgrid">
              {(["food_share", "birthday", "karaoke", "sports", "church", "outdoors", "gathering"] as EventCategory[]).map((c) => (
                <button key={c} className={`hostopt${c === "food_share" ? " food" : ""}`} onClick={() => setHosting(false)}>
                  <Icon name={c} size={22} stroke={1.8} /><span>{EVENT_CATEGORY_LABEL[c]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
