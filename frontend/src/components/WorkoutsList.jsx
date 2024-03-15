import { useState, useEffect, useContext } from "react";
import axios from "axios";
import WorkoutsCard from "./WorkoutsCard";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";


const API_URL = "https://gravitytribe.onrender.com";

function WorkoutsList() {
  const [workouts, setWorkouts] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const [showMyWorkoutsOnly, setShowMyWorkoutsOnly] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/workouts`)
      .then((response) => {
        setWorkouts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const filterWorkoutsByDifficulty = (difficulty) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
    }
  };

  const toggleShowMyWorkouts = () => {
    setShowMyWorkoutsOnly((prevState) => !prevState);
  };

  const filteredWorkouts = selectedDifficulty ? workouts.filter((workout) => workout.expLevel === selectedDifficulty): workouts;

  const displayedWorkouts = showMyWorkoutsOnly ? filteredWorkouts.filter((workout) => workout.createdBy === ourUser._id) : filteredWorkouts;

  return (
    <div className="page">
      <section id={"skillsLevelsButtons"}>
        <section>
          <button className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}} onClick={() => filterWorkoutsByDifficulty("beginner")}>
            Beginner
          </button>
          <button className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}} onClick={() => filterWorkoutsByDifficulty("intermediate")}>
            Intermediate
          </button>
          <button className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}}onClick={() => filterWorkoutsByDifficulty("advanced")}>
            Advanced
          </button>
          <button className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}}onClick={() => filterWorkoutsByDifficulty("master")}>
            Master
          </button>

        </section>
        <section style={{display: "flex", justifyContent: "center"}}>
        <button
          onClick={() => {
            navigate("/workouts/create");
          }}
          className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}}
        >
          Create Your Workout
        </button>
        <button className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d", margin:"10px"}}onClick={() => toggleShowMyWorkouts()}>
            Created By Me
          </button>
        </section>
      </section>
      <section style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "50px", paddingTop: "50px", paddingBottom: "50px"}}>
        {displayedWorkouts &&
          displayedWorkouts.map((workout) => {
            return <WorkoutsCard workout={workout} id={workout._id} key={workout._id}/>;
          })}
      </section>
    </div>
  );
}

export default WorkoutsList;
