import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

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

  return (
    <div>
      <section>
        <img></img>
        <h1>{workout.workoutType}</h1>
        <h3>{workout.expLevel}</h3>
      </section>
      {workout &&
        workout.exercises.map((single) => {
          return (
            <article>
              <h3>{single.description}</h3>
              <p>
                Do {single.sets} sets of {single.repetitions} {single.type}.
              </p>
            </article>
          );
        })}
      {workout.createdBy === ourUser.name && (
        <section>
          <button onClick={handleDelete}>Delete Workout</button>
        </section>
      )}
    </div>
  );
}

export default WorkoutDetails;
