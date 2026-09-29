import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import "./Shell.css";

/** Phone: content + bottom nav. Desktop: left rail + content. */
export default function Shell() {
  return (
    <div className="shell">
      <Nav />
      <div className="content"><Outlet /></div>
    </div>
  );
}
