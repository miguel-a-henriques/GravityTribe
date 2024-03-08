import React from "react";
import { useNavigate } from "react-router-dom";

function Buttons() {
  const navigate = useNavigate();
  return (
    <div>
      <a onClick={()=>{navigate("/parkslist")}}>Parks</a>
      <a onClick={()=>{navigate("/workouts")}}>Workouts</a>
      <a onClick={()=>{navigate("/events")}}>Events</a>
    </div>
  );
}

export default Buttons;
