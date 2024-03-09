import { useState, useEffect } from "react";
import axios from "axios";
import WorkoutsCard from "./WorkoutsCard";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function WorkoutsList() {
  const [workouts, setWorkouts] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const navigate = useNavigate();

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

  const filterWorkoutsByDifficulty = (difficulty) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
    }
  };

  const filteredWorkouts = selectedDifficulty ? workouts.filter((workout) => workout.expLevel === selectedDifficulty) : workouts;

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
        {filteredWorkouts &&
          filteredWorkouts.map((workout) => {
            return <WorkoutsCard workout={workout} id={workout._id} />;
          })}
      </section>
    </div>
  );
}

export default WorkoutsList;
