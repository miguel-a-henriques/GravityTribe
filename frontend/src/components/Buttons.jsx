import React from "react";
import { useNavigate } from "react-router-dom";

function Buttons() {
  const navigate = useNavigate();
  return (
    <div className="buttons-bar">
      <button onClick={()=>{navigate("/parkslist")}}>Parks</button>
      <button onClick={()=>{navigate("/workouts")}}>Workouts</button>
      <button>Coming Soon</button>
    </div>
  );
}

export default Buttons;