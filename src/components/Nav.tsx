import { NavLink } from "react-router-dom";
import { Icon, Mark } from "./Icon";
import "./Nav.css";

/** Bottom bar on phone; left rail on desktop. Map · Events · Feed · Chats · Profile. */
export default function Nav() {
  const item = (to: string, icon: Parameters<typeof Icon>[0]["name"], label: string) => (
    <NavLink to={to} end={to === "/"} className={({ isActive }) => `nv${isActive ? " active" : ""}`}>
      <Icon name={icon} size={22} stroke={1.7} />{label}
    </NavLink>
  );
  return (
    <nav className="nav">
      <div className="brandmark"><Mark size={40} /></div>
      {item("/", "map", "Map")}
      {item("/events", "events", "Events")}
      {item("/feed", "feed", "Feed")}
      {item("/chats", "chat", "Chats")}
      {item("/profile", "you", "Profile")}
    </nav>
  );
}
