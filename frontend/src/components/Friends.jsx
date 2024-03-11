import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
const API_URL = "http://localhost:5005";
import axios from "axios";
import { Link } from "react-router-dom";

function Friends() {
  const [users, setUsers] = useState([]);
  const {user, isLoggedIn} = useContext(AuthContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersFiltered, setUsersFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/users`)
        .then((response) => {
          setUsers(response.data);

          const filter = response.data.filter((a) => a._id !== user._id);
          setUsersFiltered(filter);
          setFilteredUsers(filter);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn, user]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);

    if(query === ""){
      setFilteredUsers(usersFiltered)
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={handleSearch}
      />
      {isLoggedIn ? (
        filteredUsers &&
        filteredUsers.map((user) => (
          <Link to={`/profile/${user._id}`} key={user._id}>
            <article>
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
