import { BrowserRouter, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import MapScreen from "./screens/MapScreen";
import Welcome from "./screens/Welcome";
import Placeholder from "./screens/Placeholder";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route element={<Shell />}>
          <Route path="/" element={<MapScreen />} />
          <Route path="/events" element={<Placeholder title="Events" note="Birthdays, karaoke, sports, gatherings — anything with an open door." />} />
          <Route path="/host" element={<Placeholder title="Host a meal" note="I'm making sinigang for 4, come through. Dish, time, seats, area." />} />
          <Route path="/chats" element={<Placeholder title="Chats" note="Messages, plus a thread for every meal you're in." />} />
          <Route path="/you" element={<Placeholder title="You" note="Your profile, your kapits, your settings." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
