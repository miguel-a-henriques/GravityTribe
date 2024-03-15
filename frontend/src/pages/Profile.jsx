import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://gravitytribe.onrender.com";

function Profile() {
  const { id } = useParams();
  const [thisUser, setThisUser] = useState({});
  const [allWorkouts, setAllWorkouts] = useState([]);
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState();
  const [allPosts, setAllPosts] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_URL}/api/user/${id}`)
      .then((response) => {
        setThisUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

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

  const userWorkouts = allWorkouts.filter(
    (workout) => workout.createdBy === thisUser._id
  );

  const userPosts = allPosts.filter(
    (post) => post.userId === thisUser._id
  )

  const handleFollowUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${user._id}`);
      const existingData = response.data;

      const newFollow = {
        name: thisUser.name,
        photo: thisUser.photo,
        _id: thisUser._id,
      };

      const newFollowed = {
        name: user.name,
        photo: user.photo,
        _id: user._id,
      };

      const updatedUser = {
        ...existingData,
        follow: [...(existingData.follow || []), newFollow],
      };

      await axios.put(`${API_URL}/api/user/${user._id}`, updatedUser);
      console.log("You now follow this user... stalker");

      // Update the user being followed (thisUser)
      const updatedThisUser = {
        ...thisUser, // Use thisUser instead of existingData
        followedBy: [...(thisUser.followedBy || []), newFollowed],
      };

      await axios.put(`${API_URL}/api/user/${thisUser._id}`, updatedThisUser);
      console.log("You are now followed by this user.");
    } catch (error) {
      console.error("Error while following this user", error);
    }
    window.location.reload();
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${user._id}`);
      const existingData = response.data;

      const updatedUser = {
        ...existingData,
        follow: existingData.follow.filter(
          (followedUser) => followedUser._id !== thisUser._id
        ),
      };

      await axios.put(`${API_URL}/api/user/${user._id}`, updatedUser);
      console.log("You no longer follow this user.");

      // Update the user that was being followed (thisUser)
      const responseThisUser = await axios.get(
        `${API_URL}/api/user/${thisUser._id}`
      );
      const existingThisUserData = responseThisUser.data;

      const updatedThisUser = {
        ...existingThisUserData,
        followedBy: existingThisUserData.followedBy.filter(
          (followerUser) => followerUser._id !== user._id
        ),
      };

      await axios.put(`${API_URL}/api/user/${thisUser._id}`, updatedThisUser);
      console.log("You are no longer followed by this user.");
    } catch (error) {
      console.error("Error while unfollowing this user", error);
    }
    window.location.reload();
  };

  return (
    <div className="page">
      <section>
        <div className="user-card">
          <img src={thisUser.photo} className="user-profile-img" />
          <div className="user-card-info">
            <h1>{thisUser.name}</h1>
            <div className="user-following">
              <h2>
                Followed by{" "}
                {thisUser && thisUser.followedBy
                  ? thisUser.followedBy.length
                  : ""}
              </h2>
              <h2>
                Following{" "}
                {thisUser && thisUser.follow ? thisUser.follow.length : ""}
              </h2>
            </div>
            <div className="user-exp-button">
              <h3>
                Experience:{" "}
                {thisUser.expLevel
                  ? thisUser.expLevel.charAt(0).toUpperCase() +
                    thisUser.expLevel.slice(1)
                  : ""}
              </h3>
              {isLoggedIn &&
              thisUser &&
              ourUser &&
              ourUser._id &&
              thisUser.followedBy &&
              thisUser.followedBy.some(
                (followedUser) => followedUser._id === ourUser._id
              ) ? (
                <button onClick={handleUnfollowUser} className="follow-button">
                  Unfollow
                </button>
              ) : (
                <button onClick={handleFollowUser} className="follow-button">
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
          marginTop: "30px",
        }}
      >
        <h1>Posts</h1>
        {isLoggedIn &&
        thisUser &&
        thisUser._id &&
        userPosts &&
        userPosts.some((post) => post.userId === thisUser._id)
          ? userPosts.map((post, index) => {
              return (
                <article key={index} className="post">
                  {post.userId === thisUser._id ? (
                    <article>
                      <div className="post-header">
                        <Link to={`/profile/${post.userId}`}>
                          <img
                            src={post.userPhoto}
                            style={{ height: "50px", width: "50px" }}
                          ></img>
                        </Link>
                        <Link to={`/profi/${post.userId}`}>
                          <p style={{ color: "black" }}>{post.username}</p>
                        </Link>
                      </div>
                      <img src={post.image} className="post-img" />
                      <p className="post-text">{post.text}</p>
                    </article>
                  ) : (
                    null
                  )}
                </article>
              );
            })
          : `${thisUser.name} hasn't posted yet.`}
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
          marginTop: "30px",
        }}
      >
        <h1>Workouts from {thisUser.name}</h1>
        <article
          style={{
            /* display: "flex", */ flexDirection: "column",
            paddingTop: "10px",
            paddingBottom: "50px",
          }}
        >
          {userWorkouts.length > 0 ? (
            userWorkouts.map((workout, index) => (
              <article key={index} style={{ margin: "35px" }}>
                  <div>
                    <div class="card">
                      <div class="card-details">
                        <h2 class="text-title">
                          {workout && workout.name
                            ? workout.name.charAt(0).toUpperCase() +
                              workout.name.slice(1)
                            : ""}
                        </h2>
                        <h2 class="text-body">
                          Type:{" "}
                          {workout && workout.workoutType
                            ? workout.workoutType.charAt(0).toUpperCase() +
                              workout.workoutType.slice(1)
                            : ""}
                        </h2>
                        <h3 class="text-body">
                          Difficulty:{" "}
                          {workout && workout.expLevel
                            ? workout.expLevel.charAt(0).toUpperCase() +
                              workout.expLevel.slice(1)
                            : ""}
                        </h3>
                      </div>
                      <button
                        onClick={() => navigate(`/workouts/${workout._id}`)}
                        class="card-button"
                      >
                        More...
                      </button>
                    </div>
                  </div>
                
                
              </article>
            ))
          ) : (
            <p>{`No workouts created by ${thisUser.name}.`}</p>
          )}
        </article>
      </section>
    </div>
  );
}

export default Profile;
