import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import logo from "../images/GT_LOGO1.png"

const API_URL = "https://gravitytribe.onrender.com";

function Navbar() {
  const { isLoggedIn, logOut, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ourUser, setOurUser] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/user/${user._id}`)
        .then((response) => {
          setOurUser(response.data);
          setOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  const handleLogOut = () => {
    logOut();
    navigate("/");
  };
  /* return (
    <div className="navbar">
      <a onClick={() => navigate("")}>
        <img src="https://res.cloudinary.com/dcwbdnzjt/image/upload/v1710325473/devHub/tnwfxme4wqiu6w6kxre4.png" />
      </a>

      {isLoggedIn ? (
        <div>
          <img
            src={ourUser.photo}
            style={{ borderRadius: "50%" }}
            onClick={handleOpen}
            className="user-icon"
          />
          <div>
            {open ? (
              <div className="navbar-buttons">
                <button className="Btn" onClick={handleLogOut}>
                  <div class="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>

                  <div className="text">Logout</div>
                </button>
                <button
                  className="Btn"
                  onClick={() => {
                    navigate(`/userprofile/`);
                  }}
                >
                  <div class="sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>

                  <div className="text">My Profile</div>
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </div>
  ); */

  return (
    <div className="navbar">
      <a onClick={() => navigate("")}>
        <img src={logo}/* "https://res.cloudinary.com/dcwbdnzjt/image/upload/v1710325473/devHub/tnwfxme4wqiu6w6kxre4.png" */ />
      </a>

      {isLoggedIn ? (
  <div className="dropdown dropdown-bottom">
    <div>
      <div className="relative ">
        <div tabIndex={0} role="button" className="m-1">
          <img src={ourUser.photo} alt="Profile" style={{ borderRadius: "50%", width: "80px", height: "80px" }} onClick={handleOpen}/>
        </div>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52" >
          <li>
            <button className={"text-white"} onClick={handleLogOut}>Logout</button>
          </li>
          <li>
            <button
            className={"text-white"}
              onClick={() => {
                navigate(`/userprofile/`);
              }}
            >
              My Profile
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
) : (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </div>
  );
}

export default Navbar;
