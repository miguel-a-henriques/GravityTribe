import React from "react";
import { useNavigate } from "react-router-dom";
import Park from "../images/park.png"
import Workout from "../images/plan.png"
import Soon from "../images/coming-soon.png"

function Buttons() {
  const navigate = useNavigate();
  return (
    <div className="buttons-bar">
      <button onClick={()=>{navigate("/parkslist")}} className="button-left">
        <img src={Park}/>
        Parks
      </button>
      <button onClick={()=>{navigate("/workouts")}} className="button-left">
      <img src={Workout}/>
        Workouts
      </button>
      <button className="button-left">
      <img src={Soon}/>
        Events
      </button>
    </div>
  );
}

export default Buttons;