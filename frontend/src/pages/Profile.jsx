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
    axios
      .get(`${API_URL}/api/workouts`)
      .then((response) => {
        setAllWorkouts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
  };

  return (
    <div>
      <section>
        <img src={thisUser.photo} alt="User's Photo" />
        <h2>{thisUser.name}</h2>
        <button onClick={handleFollowUser}>Follow</button>
      </section>
      <section>
        <h2>Posts</h2>
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
