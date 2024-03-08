import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WorkoutsCard from "./WorkoutsCard";

const API_URL = "http://localhost:5005";

function WorkoutsList() {
    const [workouts, setWorkouts] = useState("")

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
                <button>Beginner</button>
                <button>Intermediate</button>
                <button>Advanced</button>
                <button>Master</button>
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