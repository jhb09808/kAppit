import { useMemo, useState } from "react";
import { byId, events, businesses, posts } from "../lib/seed";
import { useSettings } from "../lib/settings";
import "./Feed.css";

const ago = (iso: string) => { const h = Math.max(1, Math.round((Date.now() - +new Date(iso)) / 36e5)); return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`; };

/** Two tabs: Kapits (people you've connected with) and Everyone (nearby). */
export default function Feed() {
  const { settings } = useSettings();
  const [tab, setTab] = useState<"kapits" | "everyone">("everyone");
  const kapits = useMemo(() => new Set(["p2", "p5"]), []);   // from connections once auth exists
  const list = posts.filter((p) => (tab === "everyone" || kapits.has(p.author_id)) && !settings.blocked.includes(p.author_id));

  return (
    <div className="feed">
      <header className="fhead">
        <h1 className="t-title">Feed</h1>
        <div className="tabs">
          <button className={tab === "kapits" ? "on" : ""} onClick={() => setTab("kapits")}>My kapits</button>
          <button className={tab === "everyone" ? "on" : ""} onClick={() => setTab("everyone")}>Everyone nearby</button>
        </div>
      </header>

      <div className="composer"><div className="av">JT</div><input placeholder="Share something with kababayan nearby…" /></div>

      <div className="flist">
        {list.map((p) => {
          const a = byId(p.author_id)!;
          const ev = p.event_id ? events.find((e) => e.id === p.event_id) : null;
          const biz = p.business_id ? businesses.find((b) => b.id === p.business_id) : null;
          return (
            <article key={p.id} className="post">
              <div className="phead">
                <div className="av">{a.display_name.slice(0, 2).toUpperCase()}</div>
                <div><div className="pn">{a.display_name}{a.is_verified && <span className="badge badge-verified" style={{ marginLeft: 8, fontSize: 9, padding: "2px 6px" }}>Verified</span>}</div><div className="pm">{a.region_ph} · {ago(p.created_at)}</div></div>
              </div>
              <p className="pbody">{p.body}</p>
              {ev && <div className={`attach${ev.category === "food_share" ? " food" : ""}`}><div className="t-label" style={{ color: "inherit" }}>Event</div><div className="at">{ev.title}</div><button className={`btn btn-sm ${ev.category === "food_share" ? "btn-sakay" : "btn-primary"}`}>Sakay na</button></div>}
              {biz && <div className="attach biz"><div className="t-label" style={{ color: "inherit" }}>Business</div><div className="at">{biz.name}</div><span className="t-caption" style={{ color: "inherit" }}>{biz.address}</span></div>}
              <div className="pacts"><button>Kapit</button><button>Reply</button><button>Share</button></div>
            </article>
          );
        })}
        {!list.length && <div className="empty"><div className="t-card">No kapits yet.</div><p className="t-caption">Kapit someone on the map and their posts show up here.</p></div>}
      </div>
    </div>
  );
}
