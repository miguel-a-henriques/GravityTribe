import { useState, useEffect, useContext } from "react";
import axios from "axios";
import WorkoutsCard from "./WorkoutsCard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";


const API_URL = "http://localhost:5005";

function WorkoutsList() {
  const [workouts, setWorkouts] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const [showMyWorkoutsOnly, setShowMyWorkoutsOnly] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/workouts`)
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/user/${user._id}`)
        .then((response) => {
          setOurUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  const filterWorkoutsByDifficulty = (difficulty) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
    }
  };

  const toggleShowMyWorkouts = () => {
    setShowMyWorkoutsOnly((prevState) => !prevState);
  };

  const filteredWorkouts = selectedDifficulty ? workouts.filter((workout) => workout.expLevel === selectedDifficulty): workouts;

  const displayedWorkouts = showMyWorkoutsOnly ? filteredWorkouts.filter((workout) => workout.createdBy === ourUser._id) : filteredWorkouts;

  return (
    <div>
      <section id={"skillsLevelsButtons"}>
        <section>
          <button onClick={() => filterWorkoutsByDifficulty("beginner")}>
            Beginner
          </button>
          <button onClick={() => filterWorkoutsByDifficulty("intermediate")}>
            Intermediate
          </button>
          <button onClick={() => filterWorkoutsByDifficulty("advanced")}>
            Advanced
          </button>
          <button onClick={() => filterWorkoutsByDifficulty("master")}>
            Master
          </button>
          <button onClick={() => toggleShowMyWorkouts()}>
            Created By Me
          </button>
        </section>

        <button
          onClick={() => {
            navigate("/workouts/create");
          }}
        >
          Create Your Workout
        </button>
      </section>
      <section>
        {displayedWorkouts &&
          displayedWorkouts.map((workout) => {
            return <WorkoutsCard workout={workout} id={workout._id} key={workout._id}/>;
          })}
      </section>
    </div>
  );
}

export default WorkoutsList;
