import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import axios from "axios";
import { useEffect } from "react";

const API_URL = "http://localhost:5005";

function Navbar() {

  const {isLoggedIn, logOut, user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [ourUser, setOurUser] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open)
  }

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

  const handleLogOut = () =>{
    logOut();
    navigate("/")
  }  
  return (
    <div className="navbar">

      <a onClick={() => navigate("")}>
        <img src="https://res.cloudinary.com/dcwbdnzjt/image/upload/v1710325473/devHub/tnwfxme4wqiu6w6kxre4.png" />
      </a>

      {isLoggedIn ? (
        <div>
          <img src={ourUser.photo} style={{borderRadius: "50%"}} onClick={handleOpen}/>
          <div>
            {open ? (<div>
              <button onClick={handleLogOut}>Logout</button>
              {/* <button onClick={()=>{navigate(`/profile/${ourUser._id}`)}}>My Profile</button> */}
              <button onClick={()=>{navigate(`/userprofile/`)}}>My Profile</button>
            </div>) : (<div></div>)}
          </div>
        </div>
      ) : ( 
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </div>
  );
}

export default Navbar;
