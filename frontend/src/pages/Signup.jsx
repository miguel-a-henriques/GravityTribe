import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState("");
  const [expLevel, setExpLevel] = useState("")
  const [type, setType] = useState("");

  // Initialize navigate
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleSignUpSubmit = (e) => {
    // Prevent Default Actions of the Form -> refresh the page.
    e.preventDefault();

    const reqBody = { email, password, name, photo, expLevel, type };

    axios
      .post(`${API_URL}/auth/signup`, reqBody)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        /* const errorDescription = error.data.message; */
       setError("Error while signing up")
       console.log(error)
      });
  };

  return (
    <div>
      <h1>Sign-up Page</h1>
      <form onSubmit={handleSignUpSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Photo</label>
          <input type="file" onChange={handleChange} />
          <img src={photo} style={{ width: "100px", height: "100px" }} />
        </div>
        <div>
          <label htmlFor="experience-level">Experience Level</label>
          <select id="experience-level" name="experience-level" onChange={(e) => setExpLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="master">Master</option>
          </select>
        </div>
        <div>
          <label htmlFor="user-type">User Type</label>
          <select id="user-type" name="user-type" onChange={(e) => setType(e.target.value)}>
            <option value="athlete">Athlete</option>
            <option value="organization">Organization</option>
          </select>
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );  
}

export default Signup;
