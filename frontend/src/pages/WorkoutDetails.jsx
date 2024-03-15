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
        workoutId: workout._id,
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
      <section style={{marginTop: "70px", display:"flex", flexDirection:"column", alignItems:"start", gap:"10px"}}>
        <h1>{workout.name}</h1>
        <br />
        <h2><b>Type:</b> {workout.workoutType}</h2>
        <h3><b>Difficulty:</b> {workout.expLevel}</h3>
        <p style={{color:"black"}}>____________________________________</p>
        {workout &&
          workout.exercises.map((single) => {
            return (
              <article key={single.description}>
                <h3><b>{single.description}</b></h3>
                <p>   - Do {single.sets} sets of {single.repetitions} {single.type}.
                </p>
              </article>
            );
          })}
          <p style={{color:"black"}}>____________________________________</p>
      </section>
      <section style={{marginBottom:"30px", display:"flex", flexDirection:"column", alignItems:"center"}}>
      <button onClick={handleCloneWorkout} className="btn-following-allposts"style={{color: "white", backgroundColor: "#28363d", marginTop:"40px"}}>Clone Workout</button>
      {workout.createdBy === ourUser._id && (
        <div style={{marginBottom:"30px", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <section>
            <Link to={`/editworkout/${id}`}>
              <button className="btn-following-allposts"style={{color: "white", backgroundColor: "#28363d", marginTop:"40px"}}>Edit this Workout</button>
            </Link>
          </section>
          <section>
            <button className="btn-following-allposts"style={{color: "white", backgroundColor: "#28363d", marginTop:"40px"}} onClick={handleDelete}>Delete Workout</button>
          </section>
        </div>
      )}
      </section>
    </div>
  );
}

export default WorkoutDetails;
