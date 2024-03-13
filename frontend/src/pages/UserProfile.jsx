import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import editImage from "../images/edit.png";

const API_URL = "http://localhost:5005";

function UserProfile() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const [allPosts, setAllPosts] = useState();

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

  useEffect(() => {
    axios
      .get(`${API_URL}/api/posts`)
      .then((response) => setAllPosts(response.data))
      .catch((error) =>
        console.log(error.response ? error.response.data : error)
      );
  }, []);

  return (
    <div className="page">
      {isLoggedIn && ourUser ? (
        <div>
          <section>
            <div className="user-card">
              <img src={ourUser.photo} className="user-profile-img" />
              <div className="user-card-info">
                <h1>{ourUser.name}</h1>
                <div className="user-following">
                  <h2>
                    Followed by{" "}
                    {ourUser && ourUser.followedBy
                      ? ourUser.followedBy.length
                      : ""}
                  </h2>
                  <h2>
                    Following{" "}
                    {ourUser && ourUser.follow ? ourUser.follow.length : ""}
                  </h2>
                </div>

                <div className="user-exp-button">
                  <h3>
                    Experience:{" "}
                    {ourUser.expLevel
                      ? ourUser.expLevel.charAt(0).toUpperCase() +
                        ourUser.expLevel.slice(1)
                      : ""}
                  </h3>
                  <Link to={`/profile/edit/${user._id}`}>
                    <button>
                      <img src={editImage} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h1>Posts</h1>
            {isLoggedIn &&
            allPosts &&
            ourUser &&
            ourUser._id &&
            allPosts.some((post) => post.userId === ourUser._id)
              ? allPosts.map((post, index) => {
                  return (
                    <section key={index}>
                      {post.userId === ourUser._id ? (
                        <article>
                          <img src={post.image} alt="" />
                          <p>{post.text}</p>
                          <img
                            src={post.userPhoto}
                            style={{ height: "20px", width: "20px" }}
                          ></img>
                          <p>{post.username}</p>
                        </article>
                      ) : (
                        ""
                      )}
                    </section>
                  );
                })
              : "You haven't shared anything yet!"}
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
