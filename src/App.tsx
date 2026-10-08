import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import MapScreen from "./screens/MapScreen";
import Welcome from "./screens/Welcome";
import Events from "./screens/Events";
import Feed from "./screens/Feed";
import Settings from "./screens/Settings";
import Placeholder from "./screens/Placeholder";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route element={<Shell />}>
          <Route path="/" element={<MapScreen />} />
          <Route path="/events" element={<Events />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chats" element={<Placeholder title="Chats" note="Messages, plus a thread for every event you're in." />} />
          <Route path="/profile" element={<Placeholder title="Profile" note="Your photo, where you're from, your type, your kapits." />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/blocked" element={<Placeholder title="Blocked people" note="Nobody blocked. Block from any profile, event, or chat." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
