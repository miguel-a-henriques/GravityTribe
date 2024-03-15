import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import editImage from "../images/edit.png";
import { useNavigate } from "react-router-dom";

const API_URL = "https://gravitytribe.onrender.com";

function UserProfile() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const [allPosts, setAllPosts] = useState();

  const [allWorkouts, setAllWorkouts] = useState();
  const navigate = useNavigate()

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

  function handleDelete(post) {
    axios
      .delete(`${API_URL}/api/posts/${post._id}`)
      .then(() => {
        axios
          .get(`${API_URL}/api/posts`)
          .then((response) => setAllPosts(response.data))
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

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

          <section style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "40px", marginTop: "30px"}}>
            <h1>Posts</h1>
            {isLoggedIn &&
            allPosts &&
            ourUser &&
            ourUser._id &&
            allPosts.some((post) => post.userId === ourUser._id)
              ? allPosts.map((post, index) => {
                  return (
                    <section key={index} className="post">
                      {post.userId === ourUser._id ? (
                        <article>
                          <article>
                            <div className="post-header">
                              <Link to={`/profile/${post.userId}`}>
                                <img
                                  src={post.userPhoto}
                                  style={{ height: "50px", width: "50px" }}
                                ></img>
                              </Link>
                              <Link to={`/profi/${post.userId}`}>
                                <p style={{ color: "black" }}>
                                  {post.username}
                                </p>
                              </Link>
                            </div>
                            <img src={post.image} className="post-img" />
                            <p className="post-text">{post.text}</p>
                          </article>
                          <section>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(post)}
                            >
                              <svg class="delete-svgIcon" viewBox="0 0 448 512">
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                              </svg>
                            </button>
                          </section>
                        </article>
                      ) : (
                        ""
                      )}
                    </section>
                  );
                })
              : "You haven't shared anything yet!"}
          </section>
          <section style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: "40px", marginTop: "30px"}}>
            <h1>Workouts</h1>
            <article style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
              <h3>- Created Workouts - </h3>
              <article style={{/* display: "flex", */ flexDirection:"column", paddingTop: "10px", paddingBottom: "50px"}}>
              {isLoggedIn && allWorkouts && ourUser ? (
                allWorkouts.map((workout, index) => {
                  return (
                    <article key={index} style={{margin: "35px"}}>
                      {workout.createdBy === ourUser._id ? (
                        <div>
                        <div class="card">
                          <div class="card-details">
                          <h2 class="text-title">
                            {workout && workout.name
                              ? workout.name.charAt(0).toUpperCase() + workout.name.slice(1)
                              : ""}
                          </h2>
                          <h2 class="text-body">Type: {workout && workout.workoutType
                              ? workout.workoutType.charAt(0).toUpperCase() +
                                workout.workoutType.slice(1)
                              : ""}
                          </h2>
                          <h3 class="text-body">Difficulty: {workout && workout.expLevel
                              ? workout.expLevel.charAt(0).toUpperCase() +
                                workout.expLevel.slice(1)
                              : ""}
                          </h3>
                          </div>
                          <button onClick={()=>navigate(`/workouts/${workout._id}`)} class="card-button">More...</button>
                        </div>
                      </div>
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
            </article>
            <article>
            <article style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems:"center"}}>
              <h3>- Cloned Workouts -</h3>
              <article style={{/* display: "flex", */ flexDirection:"column", paddingTop: "10px", paddingBottom: "50px"}}>
              {isLoggedIn &&
              ourUser &&
              ourUser.workouts &&
              ourUser.workouts.length > 0 ? (
                ourUser.workouts.map((workout, index) => {
                  return (
                    <article key={index} style={{margin: "35px"}}>
                    <div>
                        <div class="card">
                          <div class="card-details">
                          <h2 class="text-title">
                            {workout && workout.name
                              ? workout.name.charAt(0).toUpperCase() + workout.name.slice(1)
                              : ""}
                          </h2>
                          <h2 class="text-body">Type: {workout && workout.workoutType
                              ? workout.workoutType.charAt(0).toUpperCase() +
                                workout.workoutType.slice(1)
                              : ""}
                          </h2>
                          <h3 class="text-body">Difficulty: {workout && workout.expLevel
                              ? workout.expLevel.charAt(0).toUpperCase() +
                                workout.expLevel.slice(1)
                              : ""}
                          </h3>
                          </div>
                          <button onClick={()=>navigate(`/workouts/${workout.workoutId}`)} class="card-button">More...</button>
                        </div>
                      </div>
                      </article>
                  );
                })
              ) : (
                <h2>No cloned workouts available</h2>
              )}
              </article>
            </article>
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
