import { useState, useEffect, useContext } from "react";
const API_URL = "https://gravitytribe.onrender.com";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

function CreateWorkoutPage() {
  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState("push");
  const [expLevel, setExpLevel] = useState("beginner");
  const [exNumber, setExNumber] = useState("");
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sets, setSets] = useState();
  const [type, setType] = useState("");
  const [repetitions, setRepetitions] = useState();
  const [description, setDescription] = useState();

  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});

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

  const handleExNumberChange = (e) => {
    const value = e.target.value;
    setExNumber(value);
    generateExerciseInputs(value);
  };

  const generateExerciseInputs = (count) => {
    const exerciseInputs = [];
    for (let i = 0; i < parseInt(count); i++) {
      exerciseInputs.push({ description: "" });
    }
    setExercises(exerciseInputs);
  };

  const handleExNumChange = (e, index) => {
    const { value } = e.target;

    setExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[index] = { description: value };
      return updatedExercises;
    });

    setDescription(value);
  };

  const handleWorkoutCreate = (e) => {
    e.preventDefault();

    const exercisesArray = exercises.map((exercise) => ({
      description: exercise.description,
      sets,
      repetitions,
      type,
    }));

    const reqBody = {
      name,
      workoutType,
      expLevel,
      exercises: exercisesArray,
      createdBy: ourUser._id,
    };

    axios
      .post(`${API_URL}/api/workouts`, reqBody)
      .then(() => {
        navigate("/workouts");
      })
      .catch((error) => {
        setError("Failed to create workout. Please try again.");
        console.log(error);
      });
  };

  return (
    <div className="page">
      {isLoggedIn ? (
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <h1>Create Your Workout</h1>
          <form onSubmit={handleWorkoutCreate} style={{ marginBottom: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <label>Name your Workout: </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ color: "#3f5e60", padding: "5px", marginLeft: "5px" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Workout Type: </label>
              <select
                id="workout-type"
                name="workout-type"
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setWorkoutType(e.target.value)}
                style={{ color: "#3f5e60", marginLeft: "5px" }}
              >
                <option value="null">-</option>
                <option value="push">Push</option>
                <option value="pull">Pull</option>
                <option value="legs">Legs</option>
                <option value="skills">Skills</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Experience Level: </label>
              <select
                id="experience-level"
                name="experience-level"
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setExpLevel(e.target.value)}
                style={{ color: "#3f5e60", marginLeft: "5px" }}
              >
                <option value="null">-</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Number of exercises: </label>
              <select
                id="number"
                name="number"
                className="select select-bordered w-full max-w-xs"
                onChange={handleExNumberChange}
                style={{ color: "#3f5e60", marginLeft: "5px" }}
              >
                <option value="null">-</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div>
              {exercises.map((exercise, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <label>Exercise {index + 1}: </label>
                  <input
                    type="text"
                    value={exercise.description}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => handleExNumChange(e, index)}
                    style={{
                      color: "#3f5e60",
                      padding: "5px",
                      marginLeft: "5px",
                    }}
                  />
                  <label> Sets: </label>
                  <select
                    id="sets"
                    name="sets"
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setSets(e.target.value)}
                    style={{
                      color: "#3f5e60",
                      marginLeft: "5px",
                    }}
                  >
                    <option value="null">-</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>

                  <select
                    id="reps"
                    name="reps"
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setRepetitions(e.target.value)}
                    style={{
                      color: "#3f5e60",
                      marginLeft: "5px",
                    }}
                  >
                    <option value="null">-</option>
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                  <select
                    name="type"
                    id="typeRep"
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setType(e.target.value)}
                    style={{
                      color: "#3f5e60",
                      marginLeft: "5px",
                    }}
                  >
                    <option value="null">-</option>
                    <option value="secs">Seconds</option>
                    <option value="reps">Repetitions</option>
                  </select>
                </div>
              ))}
            </div>
            <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
              <button
                type="submit"
                className="btn-following-allposts"
                style={{
                  color: "white",
                  backgroundColor: "#28363d",
                  marginTop: "40px",
                }}
              >
                Create Workout
              </button>
            </div>

            {error && <p>{error}</p>}
          </form>
        </div>
      ) : (
        <h2>Please Login to create a workout</h2>
      )}
    </div>
  );
}

export default CreateWorkoutPage;
