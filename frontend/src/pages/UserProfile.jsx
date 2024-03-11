import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

const API_URL = "http://localhost:5005";

function UserProfile() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});

  const [allWorkouts, setAllWorkouts] = useState();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/${user._id}`)
      .then((response) => {
        setOurUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/workouts`)
      .then((response) => {
        setAllWorkouts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {isLoggedIn && ourUser ? (
        <div>
          <section>
            <img src={ourUser.photo} />
            <h1>{ourUser.name}</h1>
            <h3>
              Experience Level:{" "}
              {ourUser.expLevel
                ? ourUser.expLevel.charAt(0).toUpperCase() +
                  ourUser.expLevel.slice(1)
                : ""}
            </h3>
            <Link to={`/profile/edit/${user._id}`}>
              <button>Edit My Profile</button>
            </Link>
          </section>
          <section>
            <h1>Posts</h1>
          </section>
          <section>
            <h1>Workouts</h1>
            <article>
              <h3>Created Workouts</h3>
              {isLoggedIn && allWorkouts && ourUser ? (
                allWorkouts.map((workout, index) => {
                  return (
                    <article key={index}>
                      {workout.createdBy === ourUser._id ? (
                        <h2>{workout.name}</h2>
                      ) : (
                        ""
                      )}
                    </article>
                  );
                })
              ) : (
                <article>
                  <h2>You haven't created any workouts yet!</h2>
                  <Link to={"/workouts/create"}>
                  <button>Create Your Workout</button>
                  </Link>
                </article>
              )}
            </article>
            <article>
              <h3>Cloned Workouts</h3>
              {isLoggedIn &&
              ourUser &&
              ourUser.workouts &&
              ourUser.workouts.length > 0 ? (
                ourUser.workouts.map((workout, index) => {
                  return (
                    <article key={index}>
                      <h2>{workout.name}</h2>
                      <h3>{workout.workoutType}</h3>
                      <p>{workout.expLevel}</p>
                      {workout.exercises.map((exercise, index) => {
                        return (
                          <article key={index}>
                            <h3>{exercise.description}</h3>
                            <p>
                              Do {exercise.sets} sets of {exercise.repetitions}{" "}
                              {exercise.type}.
                            </p>
                          </article>
                        );
                      })}
                    </article>
                  );
                })
              ) : (
                <h2>No cloned workouts available</h2>
              )}
            </article>
          </section>
        </div>
      ) : (
        <h2>Please Log In to see you profile</h2>
      )}
    </div>
  );
}

export default UserProfile;
