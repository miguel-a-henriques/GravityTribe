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
  const [ourUser, setOurUser] = useState({});

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
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/users`)
        .then((response) => {
          setUsers(response.data);

          const filter = ourUser.follow;

          // Initial state of the users to be displayed (starts as every user we follow)
          setFilteredUsers(filter);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn, ourUser]);


  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);

    if(query === ""){
      setFilteredUsers(ourUser.follow)
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
              <img src={user.photo} alt="" style={{width:"50px", height:"50px"}}/>
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