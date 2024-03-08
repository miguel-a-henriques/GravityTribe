import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function WorkoutDetails() {

  const {id} = useParams();
  const [workout, setWorkout] = useState("")

  useEffect(() =>{
    axios.get(`${API_URL}/api/workouts/${id}`)
    .then((response)=>{
      setWorkout(response.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  }, [])
  return (
    <div>
      <img></img>
      <h1>{workout.workoutType}</h1>
      <h3>{workout.expLevel}</h3>
    </div>
  )
}

export default WorkoutDetails