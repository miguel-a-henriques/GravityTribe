import { useState, useEffect, useContext } from "react";
const API_URL = "http://localhost:5005";
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
      createdBy: ourUser.name,
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
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Create Your Workout</h1>
          <form onSubmit={handleWorkoutCreate}>
            <div>
              <label>Name your Workout:</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Workout Type:</label>
              <select
                id="workout-type"
                name="workout-type"
                onChange={(e) => setWorkoutType(e.target.value)}
              >
                <option value="null">-</option>
                <option value="push">Push</option>
                <option value="pull">Pull</option>
                <option value="legs">Legs</option>
                <option value="skills">Skills</option>
              </select>
            </div>

            <div>
              <label>Experience Level</label>
              <select
                id="experience-level"
                name="experience-level"
                onChange={(e) => setExpLevel(e.target.value)}
              >
                <option value="null">-</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div>
              <label>Number of exercises:</label>
              <select id="number" name="number" onChange={handleExNumberChange}>
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
                <div key={index}>
                  <label>Exercise {index + 1}:</label>
                  <input
                    type="text"
                    value={exercise.description}
                    onChange={(e) => handleExNumChange(e, index)}
                  />
                  <label>Sets:</label>
                  <select
                    id="sets"
                    name="sets"
                    onChange={(e) => setSets(e.target.value)}
                  >
                    <option value="null">-</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                  <select
                    name="type"
                    id="typeRep"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="null">-</option>
                    <option value="secs">Seconds</option>
                    <option value="reps">Repetitions</option>
                  </select>
                  <select
                    id="reps"
                    name="reps"
                    onChange={(e) => setRepetitions(e.target.value)}
                  >
                    <option value="null">-</option>
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              ))}
            </div>
            <div>
              <button type="submit">Create Workout</button>
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
