import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
const API_URL = "http://localhost:5005";
import axios from "axios";
import { Link } from "react-router-dom";

function Friends() {
  const [users, setUsers] = useState([]);
  const {user, isLoggedIn} = useContext(AuthContext);
  const [filteredUsers, setFilteredUsers] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/users`)
        .then((response) => {
          setUsers(response.data);

          const filter = response.data.filter((a) => a._id !== user._id);
          setFilteredUsers(filter);

          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        filteredUsers &&
        filteredUsers.map((user) => (
          <Link to={`/profile/${user._id}`}>
            <article key={user._id}>
              <h2>{user.name}</h2>
            </article>
          </Link>
        ))
      ) : (
        <h2>Login to See Users</h2>
      )}
    </div>
  );
}

export default Friends;
