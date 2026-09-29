import { NavLink } from "react-router-dom";
import { Icon, Mark } from "./Icon";
import "./Nav.css";

/** Bottom bar on phone; left rail on desktop. Host is the raised flan button. */
export default function Nav() {
  const item = (to: string, icon: Parameters<typeof Icon>[0]["name"], label: string) => (
    <NavLink to={to} className={({ isActive }) => `nv${isActive ? " active" : ""}`}>
      <Icon name={icon} size={22} stroke={1.7} />{label}
    </NavLink>
  );
  return (
    <nav className="nav">
      <div className="brandmark"><Mark size={40} /></div>
      {item("/", "map", "Map")}
      {item("/events", "events", "Events")}
      <NavLink to="/host" className={({ isActive }) => `nv host${isActive ? " active" : ""}`}>
        <span className="fab"><Icon name="plus" size={24} stroke={2.4} /></span>Host
      </NavLink>
      {item("/chats", "chat", "Chats")}
      {item("/you", "you", "You")}
    </nav>
  );
}
