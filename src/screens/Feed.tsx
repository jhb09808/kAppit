import { useMemo, useState } from "react";
import { byId, events, businesses, posts as seedPosts } from "../lib/seed";
import { useSettings } from "../lib/settings";
import type { Post, PostMedia } from "../lib/types";
import { Icon } from "../components/Icon";
import "./Feed.css";

const ago = (iso: string) => { const h = Math.max(1, Math.round((Date.now() - +new Date(iso)) / 36e5)); return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`; };
const URL_RE = /https?:\/\/[^\s]+/g;

/** Body text with links made clickable. */
function Body({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  const urls = text.match(URL_RE) ?? [];
  return <p className="pbody">{parts.map((t, i) => <span key={i}>{t}{urls[i] && <a href={urls[i]} target="_blank" rel="noopener noreferrer">{urls[i].replace(/^https?:\/\//, "")}</a>}</span>)}</p>;
}

function Media({ media }: { media: PostMedia[] }) {
  if (!media.length) return null;
  const [lightbox, setLightbox] = useState<string | null>(null);
  const vid = media.find((m) => m.type === "video");
  if (vid) return <div className="pmedia one"><video controls playsInline preload="metadata" poster={vid.poster} src={vid.url} /></div>;
  const imgs = media.slice(0, 4);
  return (
    <>
      <div className={`pmedia n${imgs.length}`}>{imgs.map((m, i) => <img key={i} src={m.url} alt={m.alt ?? ""} loading="lazy" onClick={() => setLightbox(m.url)} />)}</div>
      {lightbox && <div className="lightbox" onClick={() => setLightbox(null)}><img src={lightbox} alt="" /></div>}
    </>
  );
}

function PostCard({ p, onKapit }: { p: Post; onKapit: () => void }) {
  const a = byId(p.author_id)!;
  const ev = p.event_id ? events.find((e) => e.id === p.event_id) : null;
  const biz = p.business_id ? businesses.find((b) => b.id === p.business_id) : null;
  return (
    <article className="post">
      <div className="phead">
        <div className="av">{a.display_name.slice(0, 2).toUpperCase()}</div>
        <div><div className="pn">{a.display_name}{a.is_verified && <span className="badge badge-verified">Verified</span>}</div><div className="pm">{a.region_ph} · {ago(p.created_at)}</div></div>
        <button className="more" aria-label="More">···</button>
      </div>
      <Body text={p.body} />
      <Media media={p.media} />
      {p.link && (
        <a className="linkcard" href={p.link.url} target="_blank" rel="noopener noreferrer">
          {p.link.image && <img src={p.link.image} alt="" loading="lazy" />}
          <div className="lc"><div className="ls">{p.link.site ?? new URL(p.link.url).hostname}</div><div className="lt">{p.link.title}</div>{p.link.description && <div className="ld">{p.link.description}</div>}</div>
        </a>
      )}
      {ev && <div className={`attach${ev.category === "food_share" ? " food" : ""}`}><div className="t-label">Event</div><div className="at">{ev.title}</div><button className={`btn btn-sm ${ev.category === "food_share" ? "btn-sakay" : "btn-primary"}`}>Sakay na</button></div>}
      {biz && <div className="attach biz"><div className="t-label">Business</div><div className="at">{biz.name}</div><span className="t-caption">{biz.address}</span></div>}
      <div className="pacts">
        <button onClick={onKapit}><Icon name="friends" size={16} stroke={2} />{p.kapit_count}</button>
        <button><Icon name="chat" size={16} stroke={2} />{p.reply_count}</button>
        <button className="share">Share</button>
      </div>
    </article>
  );
}

/** Two tabs: My kapits (people you've connected with) and Everyone nearby. */
export default function Feed() {
  const { settings } = useSettings();
  const [tab, setTab] = useState<"kapits" | "everyone">("everyone");
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [draft, setDraft] = useState("");
  const kapits = useMemo(() => new Set(["p2", "p5"]), []);   // from the kapits table once auth exists
  const list = posts.filter((p) => (tab === "everyone" || kapits.has(p.author_id)) && !settings.blocked.includes(p.author_id));

  const publish = () => {
    const body = draft.trim(); if (!body) return;
    const url = body.match(URL_RE)?.[0];
    setPosts([{ id: `x${Date.now()}`, author_id: "p4", body, media: [], link: url ? { url, title: new URL(url).hostname, site: new URL(url).hostname } : null, event_id: null, business_id: null, kapit_count: 0, reply_count: 0, created_at: new Date().toISOString() }, ...posts]);
    setDraft("");
  };

  return (
    <div className="feed">
      <header className="fhead">
        <h1 className="t-title">Feed</h1>
        <div className="tabs">
          <button className={tab === "kapits" ? "on" : ""} onClick={() => setTab("kapits")}>My kapits</button>
          <button className={tab === "everyone" ? "on" : ""} onClick={() => setTab("everyone")}>Everyone nearby</button>
        </div>
      </header>

      <div className="composer">
        <div className="av">JT</div>
        <div className="cbox">
          <textarea rows={1} placeholder="Share something with kababayan nearby…" value={draft} onChange={(e) => setDraft(e.target.value)} onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = `${t.scrollHeight}px`; }} />
          <div className="ctools">
            <button aria-label="Add photo" title="Photo"><Icon name="feed" size={18} /></button>
            <button aria-label="Add video" title="Video"><Icon name="karaoke" size={18} /></button>
            <button aria-label="Attach event" title="Event"><Icon name="events" size={18} /></button>
            <button className="btn btn-primary btn-sm" disabled={!draft.trim()} onClick={publish}>Post</button>
          </div>
        </div>
      </div>

      <div className="flist">
        {list.map((p) => <PostCard key={p.id} p={p} onKapit={() => setPosts((ps) => ps.map((q) => q.id === p.id ? { ...q, kapit_count: q.kapit_count + 1 } : q))} />)}
        {!list.length && <div className="empty"><div className="t-card">No kapits yet.</div><p className="t-caption">Kapit someone on the map and their posts show up here.</p></div>}
      </div>
    </div>
  );
}
