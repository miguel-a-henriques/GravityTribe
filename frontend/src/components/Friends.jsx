import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
const API_URL = "https://gravitytribe.onrender.com";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import message from "../images/message.png";

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
          setFilteredUsers(ourUser.follow);
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
      <div className="search">
        <input
          type="text"
          className="search__input"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="search__button">
          <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </button>
      </div>
      {isLoggedIn ? (
        filteredUsers &&
        filteredUsers.map((user, index) => (
          <div key={index} className="global-user global-user-card">
            <article className="global-user">
              <img src={user.photo} style={{ width: "50px", height: "50px" }} />
              <button onClick={() => navigate(`/messages/${user._id}`)}>
                <img src={message} style={{ width: "20px", height: "20px" }} />
              </button>
              <Link to={`/profile/${user._id}`} style={{ color: "black" }}>
                <h2>{user.name}</h2>
              </Link>
            </article>
          </div>
        ))
      ) : (
        <h2 style={{ color: "white", marginTop: "30px", marginLeft: "15px" }}>
          Login to See Users
        </h2>
      )}
    </div>
  );
}

export default Friends;
