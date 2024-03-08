import { useState } from "react";
const API_URL = "http://localhost:5005";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateWorkoutPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("push");
  const [expLevel, setExpLevel] = useState("beginner");
  const [exNumber, setExNumber] = useState("");
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();



  const handleExNumberChange = (e) => {
    const value = e.target.value;
    setExNumber(value);
    generateExerciseInputs(value);
  };

  const generateExerciseInputs = (count) => {
    const exerciseInputs = [];
    for (let i = 0; i < parseInt(count); i++) {
      exerciseInputs.push({ name: "" });
    }
    setExercises(exerciseInputs);
  };

  const handleExNumChange = (e, index) => {
    const { value } = e.target;
    setExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[index] = { name: value };
      return updatedExercises;
    });
  };

  const handleWorkoutCreate = (e) => {
    e.preventDefault();

    const reqBody = { name, type, expLevel, exercises };

    axios
      .post(`${API_URL}/workouts`, reqBody)
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
            onChange={(e) => setType(e.target.value)}
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
                value={exercise.name}
                onChange={(e) => handleExNumChange(e, index)}
              />
              <label>Sets:</label>
              
            </div>
          ))}
        </div>
        <div>
            <button type="submit">Create Workout</button>
        </div>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default CreateWorkoutPage;
