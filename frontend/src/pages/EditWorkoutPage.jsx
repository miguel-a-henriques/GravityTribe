import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function EditWorkoutPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [workoutType, setWorkoutType] = useState("push");
  const [expLevel, setExpLevel] = useState("beginner");
  const [exNumber, setExNumber] = useState();
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [sets, setSets] = useState();
  const [type, setType] = useState("");
  const [repetitions, setRepetitions] = useState();
  const [description, setDescription] = useState();

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/workouts/${id}`)
        .then((response) => {
          setWorkoutType(response.data.workoutType);
          setExpLevel(response.data.expLevel);
          setExercises(response.data.exercises);
          setExNumber(response.data.exercises.length);
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
      createdBy: user._id,
    };

    axios
      .put(`${API_URL}/api/workouts/${id}`, reqBody)
      .then(() => {
        navigate(`/workouts/${id}`);
      })
      .catch((error) => {
        setError("Failed to edit workout. Please try again.");
        console.log(error);
      });
  };

  return (
    <div>
      {isLoggedIn && exNumber ? (
        <div>
          <h1>Edit Your Workout</h1>
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
                defaultValue={workoutType}
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
                defaultValue={expLevel}
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
              <select
                id="number"
                name="number"
                defaultValue={exNumber}
                onChange={handleExNumberChange}
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
        <h2>Please Login to edit a workout</h2>
      )}
    </div>
  );
}

export default EditWorkoutPage;
