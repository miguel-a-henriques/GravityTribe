import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ParksList from "./pages/ParksList";
import ParkDetails from "./pages/Parkdetails";
import WorkoutsList from "./pages/WorkoutsList";
import WorkoutDetails from "./pages/WorkoutDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/parkslist" element={<ParksList />} />
        <Route path="/parkdetails/:id" element={<ParkDetails />} />
        <Route path="/workoutslist" element={<WorkoutsList />} />
        <Route path="/workoutdetails/:id" element={<WorkoutDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/eventdetails/:id" element={<EventDetails />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/userprofile" element={<UserProfile />} />

        {/* FallBack page 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
