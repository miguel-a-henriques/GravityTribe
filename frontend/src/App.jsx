import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

// Importing of the pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import ParksList from "./pages/ParksList";
import ParkDetails from "./pages/ParkDetails";
import WorkoutsPage from "./pages/WorkoutsPage";
import WorkoutDetails from "./pages/WorkoutDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import About from "./pages/About";
import CreateWorkoutPage from "./pages/CreateWorkoutPage";
import EditWorkoutPage from "./pages/EditWorkoutPage";

// Importing the components
import Navbar from "./components/Navbar";
import Friends from "./components/Friends";
import Buttons from "./components/Buttons";


function App() {
  const location = useLocation();

  // Determine if Friends and Buttons should be rendered
  const shouldRenderNavbar =
    !location.pathname.startsWith("/signup") &&
    !location.pathname.startsWith("/login");

  return (
    <div>
      {shouldRenderNavbar && (
        <div>
          <Friends />
          <Buttons />
        </div>
      )}
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage className="page"/>} />
        <Route path="/parkslist" element={<ParksList className="page"/>} />
        <Route path="/parkdetails/:id" element={<ParkDetails className="page"/>} />
        <Route path="/workouts" element={<WorkoutsPage className="page"/>} />
        <Route path="/workouts/:id" element={<WorkoutDetails className="page"/>} />
        <Route path='/workouts/create' element={<CreateWorkoutPage className="page"/>}/>
        <Route path="/editworkout/:id" element={<EditWorkoutPage className="page"/>} />
        <Route path="/events" element={<Events className="page"/>} />
        <Route path="/eventdetails/:id" element={<EventDetails className="page"/>} />
        <Route path="/profile/:id" element={<Profile className="page"/>} />
        <Route path="/userprofile" element={<UserProfile className="page"/>} />
        <Route path="/profile/edit/:id" element={<EditProfile className="page"/>} />
        <Route path='/about' element={<About />} />

        {/* FallBack page 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
