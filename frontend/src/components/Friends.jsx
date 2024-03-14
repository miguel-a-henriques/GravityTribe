import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
const API_URL = "https://gravitytribe.onrender.com";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//import search from "../images/search.png"

function Friends() {
  const [users, setUsers] = useState([]);
  const { user, isLoggedIn } = useContext(AuthContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ourUser, setOurUser] = useState({});

  const navigate = useNavigate();

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

    if (query === "") {
      setFilteredUsers(ourUser.follow);
    }
  };

  return (
    <div className="friends-bar">
      <label className="input input-bordered flex items-center gap-2">
        <input type="text" className="grow" placeholder="Search for users..." value={searchQuery}
        onChange={handleSearch}/>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
{/*       <input
        type="text"
        placeholder="Search for users..."
        value={searchQuery}
        onChange={handleSearch}
      /> */}
      {isLoggedIn ? (
        filteredUsers &&
        filteredUsers.map((user, index) => (
          <div key={index}>
            <Link to={`/profile/${user._id}`}>
              <article className="friend-card">
                <img
                  src={user.photo}
                  style={{ width: "50px", height: "50px" }}
                />
                <h2>{user.name}</h2>
              </article>
            </Link>
            <button onClick={() => navigate(`/messages/${user._id}`)}>
              Message
            </button>
          </div>
        ))
      ) : (
        <h2>Login to See Users</h2>
      )}
    </div>
  );
}

export default Friends;
