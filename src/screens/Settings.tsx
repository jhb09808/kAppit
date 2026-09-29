import { useNavigate } from "react-router-dom";
import { useSettings } from "../lib/settings";
import { people } from "../lib/seed";
import "./Settings.css";

function Row({ label, hint, right, onClick }: { label: string; hint?: string; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <div className={`srow${onClick ? " tap" : ""}`} onClick={onClick}>
      <div><div className="sl">{label}</div>{hint && <div className="sh">{hint}</div>}</div>
      <div className="sr">{right ?? (onClick ? "›" : null)}</div>
    </div>
  );
}
function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button role="switch" aria-checked={on} className={`switch${on ? " on" : ""}`} onClick={() => onChange(!on)}><i /></button>;
}

export default function Settings() {
  const nav = useNavigate();
  const { settings, update } = useSettings();
  const blocked = people.filter((p) => settings.blocked.includes(p.id));

  return (
    <div className="settings">
      <header className="shead">
        <button className="back" onClick={() => nav(-1)}>← Back</button>
        <h1 className="t-title">Settings</h1>
      </header>

      <section>
        <div className="t-label">Visibility</div>
        <Row label="Show me on the map" hint={settings.visible ? "Kababayan nearby can see you — general area only, never exact." : "You're hidden. You can still see everyone else."} right={<Switch on={settings.visible} onChange={(v) => update({ visible: v, askedVisibility: true })} />} />
        <Row label="Open to friends" right={<Switch on={settings.openToFriends} onChange={(v) => update({ openToFriends: v })} />} />
        <Row label="Open to dating" hint="Only people who also turn this on can see it. Off by default." right={<Switch on={settings.openToDating} onChange={(v) => update({ openToDating: v })} />} />
      </section>

      <section>
        <div className="t-label">Privacy</div>
        <Row label="Location" hint="Your exact location never leaves your phone. The map shows an approximate area, 200–400 m off." />
        <Row label="Addresses" hint="A host's address is shared only after they confirm you. Yours works the same way." />
        <Row label="Blocked people" hint={blocked.length ? blocked.map((b) => b.display_name).join(", ") : "Nobody blocked."} onClick={() => nav("/settings/blocked")} />
      </section>

      <section>
        <div className="t-label">kAppit Premium</div>
        <div className="premium">
          <div className="t-card">Sakay na, kapit na — all the way.</div>
          <p className="t-caption">See who viewed you, unlimited kapits, advanced filters (region, new arrivals), boosted events, and a "just landed" badge when you move to a new city.</p>
          <button className="btn btn-host" onClick={() => update({ premium: !settings.premium })}>{settings.premium ? "You're Premium ✓" : "Try Premium"}</button>
        </div>
      </section>

      <section>
        <div className="t-label">Legal</div>
        <Row label="Community guidelines" onClick={() => {}} />
        <Row label="Privacy policy" onClick={() => {}} />
        <Row label="Terms of service" onClick={() => {}} />
        <Row label="Safety tips for meeting up" onClick={() => {}} />
      </section>

      <section>
        <div className="t-label">Account</div>
        <Row label="Log out" onClick={() => nav("/welcome")} />
        <Row label="Delete account" hint="Removes your profile, posts, and events." onClick={() => {}} />
      </section>

      <p className="ver">kAppit · v0.1 · <i>kapit lang</i></p>
    </div>
  );
}
