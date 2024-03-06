import React from "react";
import { useActionData, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <a onClick={()=>navigate("")}>
        <img src="src/images/GT_LOGO.png" />
      </a>
      <button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Navbar;
