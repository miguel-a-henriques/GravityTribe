import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WorkoutsCard from "./WorkoutsCard";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function WorkoutsList() {
    const [workouts, setWorkouts] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        axios.get(`${API_URL}/api/workouts`)
        .then((response)=>{
            setWorkouts(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }, [])

    return (
        <div>
            <section id={"skillsLevelsButtons"}>
                <section>
                    <button>Beginner</button>
                    <button>Intermediate</button>
                    <button>Advanced</button>
                    <button>Master</button>
                </section>
                
                <button onClick={()=>{navigate("/workouts/create")}}>
                    Create Your Workout
                </button>
            </section>
            <section>
                {workouts && workouts.map((workout)=>{
                    return(
                        <WorkoutsCard workout={workout} id={workout._id}/>
                    )
                })}
            </section>
        </div>
    )
}

export default WorkoutsList;