import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import "tailwindcss/tailwind.css"
import "daisyui/dist/full.css"

const API_URL = "https://gravitytribe.onrender.com";

function WorkoutDetails() {
  const { id } = useParams();
  const [workout, setWorkout] = useState("");

  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const navigate = useNavigate();

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

  useEffect(() => {
    axios
      .get(`${API_URL}/api/workouts/${id}`)
      .then((response) => {
        setWorkout(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function handleDelete() {
    axios
      .delete(`${API_URL}/api/workouts/${id}`)
      .then(() => {
        navigate("/workouts");
      })
      .catch((error) => console.log(error));
  }

  async function handleCloneWorkout(e) {
    e.preventDefault();

    try {
      const response = await axios.get(`${API_URL}/api/user/${ourUser._id}`);
      const existingData = response.data;

      const newWorkout = {
        name: `Copy of ${workout.name}`,
        exercises: workout.exercises,
        expLevel: workout.expLevel,
        workoutType: workout.workoutType,
        createdBy: ourUser._id,
        workoutId: Math.random().toString(36).substr(2, 9),
      };

      const updatedUser = {
        ...existingData,
        workouts: [...(existingData.workouts || []), newWorkout],
      };
      await axios.put(`${API_URL}/api/user/${ourUser._id}`, updatedUser);
      navigate("/userprofile");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  return (
    <div className="page">
      <section>
        <img></img>
        <h1>{workout.name}</h1>
        <h2>{workout.workoutType}</h2>
        <h3>{workout.expLevel}</h3>
        {workout &&
          workout.exercises.map((single) => {
            return (
              <article key={single.description}>
                <h3>{single.description}</h3>
                <p>
                  Do {single.sets} sets of {single.repetitions} {single.type}.
                </p>
              </article>
            );
          })}
      </section>
      <button onClick={handleCloneWorkout}>Clone Workout</button>
      {workout.createdBy === ourUser._id && (
        <div>
          <section>
            <Link to={`/editworkout/${id}`}>
              <button>Edit this Workout</button>
            </Link>
          </section>
          <section>
            <button onClick={handleDelete}>Delete Workout</button>
          </section>
        </div>
      )}
    </div>
  );
}

export default WorkoutDetails;
