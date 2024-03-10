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

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <section>
            <h1>{ourUser.name}</h1>
            <h3>
              Experience Level:{" "}
              {ourUser.expLevel
                ? ourUser.expLevel.charAt(0).toUpperCase() +
                  ourUser.expLevel.slice(1)
                : ""}
            </h3>
            <Link to={`/profile/edit/${ourUser._id}`}>
              <button>Edit My Profile</button>
            </Link>
          </section>
          <section>
            <h2>Posts</h2>
          </section>
          <section>
            <h2>Workouts</h2>
          </section>
        </div>
      ) : (
        <h2>Please Log In to see you profile</h2>
      )}
    </div>
  );
}

export default UserProfile;
