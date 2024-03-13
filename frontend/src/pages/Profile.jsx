import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

const API_URL = "http://localhost:5005";

function Profile() {
  const { id } = useParams();
  const [thisUser, setThisUser] = useState({});
  const [allWorkouts, setAllWorkouts] = useState([]);
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState();
  const [allPosts, setAllPosts] = useState();

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
        follow: existingData.follow.some(
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
        followedBy: existingThisUserData.followedBy.some(
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
              thisUser.follow &&
              thisUser.follow.some(
                (followedUser) => followedUser._id === thisUser._id
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

      <section>
        <h2>Posts</h2>
        {isLoggedIn &&
        thisUser &&
        thisUser._id &&
        allPosts &&
        allPosts.some((post) => post.userId === thisUser._id)
          ? allPosts.map((post, index) => {
              return (
                <article key={index}>
                  {post.userId === thisUser._id ? (
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
                </article>
              );
            })
          : `${thisUser.name} hasn't posted yet.`}
      </section>
      <section>
        <h2>Workouts</h2>
        {userWorkouts.length > 0 ? (
          userWorkouts.map((workout, index) => (
            <article key={index}>
              <h2>{workout.name}</h2>
            </article>
          ))
        ) : (
          <p>{`No workouts created by ${thisUser.name}.`}</p>
        )}
      </section>
    </div>
  );
}

export default Profile;
