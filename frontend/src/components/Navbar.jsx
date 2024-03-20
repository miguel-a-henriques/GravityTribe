import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import logo from "../images/GT_LOGO1.png";

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

  return (
    <div className="navbar">
      <a onClick={() => navigate("")}>
        <img
          src={logo}
          /* "https://res.cloudinary.com/dcwbdnzjt/image/upload/v1710325473/devHub/tnwfxme4wqiu6w6kxre4.png" */ className="logo"
        />
      </a>

      {isLoggedIn ? (
        <div className="dropdown dropdown-bottom">
          <div>
            <div className="relative">
              <div tabIndex={0} role="button">
                <img
                  src={ourUser.photo}
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                  }}
                  onClick={handleOpen}
                />
              </div>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <button className={"text-white"} onClick={handleLogOut} style={{color: "#3f5e60"}}>
                    Logout
                  </button>
                </li>
                <li>
                  <button
                    className={"text-white"}
                    onClick={() => {
                      navigate(`/userprofile/`);
                    }}
                    style={{ color: "#3f5e60" }}
                  >
                    My Profile
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="btn-following-allposts"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Navbar;
