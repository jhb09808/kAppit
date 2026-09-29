import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mark, Wordmark } from "../components/Icon";
import "./Welcome.css";

const LINES = [
  ["Kumusta! I'm Kap.", "Welcome home — let's find your people."],
  ["This is your map.", "See who's around you tonight."],
  ["Someone's cooking tonight.", "Want in?"],
];

export default function Welcome() {
  const nav = useNavigate();
  const [splash, setSplash] = useState(true);
  const [slide, setSlide] = useState(0);
  const [kapUp, setKapUp] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setSplash(false), 2500);
    const b = setTimeout(() => setKapUp(true), 3100);      // Kap breaks the fourth wall
    const c = setTimeout(() => setKapUp(false), 6500);     // ...then settles into his slot
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);

  const next = () => (slide < 2 ? setSlide(slide + 1) : nav("/"));

  return (
    <div className="welcome">
      {/* splash: the hug draws itself */}
      <div className={`splash${splash ? "" : " gone"}`} onClick={() => setSplash(false)}>
        <div className="weave" />
        <svg viewBox="0 0 100 100" className="hug">
          <g fill="none" strokeWidth="10" strokeLinecap="round">
            <path className="arm a" d="M 56.79 50.16 A 20 20 0 1 1 39.40 37.05" stroke="#6a3fa0" />
            <path className="arm b" d="M 43.23 63.89 A 20 20 0 1 1 60.65 76.95" stroke="#f2a93b" />
          </g>
          <circle className="hd a" cx="42.5" cy="21.5" r="7.5" fill="#6a3fa0" />
          <circle className="hd b" cx="57.5" cy="21.5" r="7.5" fill="#f2a93b" />
        </svg>
        <div className="wm"><Wordmark size={52} /></div>
        <div className="tag">kapit lang</div>
      </div>

      <div className={`onboard${splash ? "" : " in"}`}>
        <div className="topbar">
          <div className="mini"><Mark size={26} /><Wordmark size={16} /></div>
          <button className="skip" onClick={() => setSlide(2)}>Skip</button>
        </div>

        <div className="stage">
          <section className={`slide${slide === 0 ? " on" : slide > 0 ? " prev" : ""}`}>
            <div className="art"><div className={`kapslot${!kapUp && !splash ? " here" : ""}`} onClick={() => setKapUp(true)} /></div>
            <h2 className="t-title">Kumusta, kababayan!</h2>
            <p>I'm Kap, your barangay kapitan. Nobody eats alone on my watch — let's find your people.</p>
          </section>
          <section className={`slide${slide === 1 ? " on" : slide > 1 ? " prev" : ""}`}>
            <div className="art"><div className="minimap"><i className="me" /><b className="mp meal" /><b className="mp event" /><b className="mp person" /><b className="mp spot" /></div></div>
            <h2 className="t-title">See who's around you tonight</h2>
            <p>A live map of kababayan, hosted meals, and gatherings — right where you already are.</p>
          </section>
          <section className={`slide${slide === 2 ? " on" : ""}`}>
            <div className="art"><div className="mealcard"><div className="bn"><span className="badge badge-live"><i />Live</span></div><div className="bd"><div className="t-label">Food share · 0.8 mi</div><div className="t-card">A big pot of sinigang</div><div className="t-caption">Tonight, 7:00 · 4 of 6 seats left</div></div></div></div>
            <h2 className="t-title">Food is the front door</h2>
            <p>Cooking too much? Kapit someone to your table. That's how strangers stop being strangers.</p>
          </section>
        </div>

        <div className="dots">{[0, 1, 2].map((i) => <i key={i} className={i === slide ? "on" : ""} onClick={() => setSlide(i)} />)}</div>
        <button className="btn btn-primary btn-block" onClick={next}>{slide === 2 ? "Let's go" : "Tara na"}</button>
        <button className="alt">Already have an account? <b>Log in</b></button>
      </div>

      {/* Kap — fourth wall layer, above everything */}
      <div className={`scrim${kapUp ? " on" : ""}`} onClick={() => setKapUp(false)} />
      <div className={`peek${kapUp ? " up" : ""}`}>
        <div className="bubble"><div className="l1">{LINES[slide][0]}</div><div className="l2">{LINES[slide][1]}</div></div>
        <div className="body" onClick={() => setKapUp(false)} />
      </div>
      {!kapUp && !splash && <button className="kapfab" aria-label="Say hi to Kap" onClick={() => setKapUp(true)}><Mark size={26} /></button>}
    </div>
  );
}
