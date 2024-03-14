import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";
import { Link } from "react-router-dom";

const API_URL = "https://gravitytribe.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { saveToken, authenticateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const reqBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, reqBody)
      .then((response) => {
        saveToken(response.data.authToken);
        /* console.log(saveToken) */
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        /* const errorDescription = error.data.message;
            setError(errorDescription) */
        console.log(error);
      });
  };

  return (
    <div className="page">
      <form className="form" onSubmit={handleLoginSubmit}>
        <div className="group">
          <input
            required="true"
            className="main-input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="highlight-span"></span>
          <label className="lebal-email">Email</label>
        </div>
        <div className="container-1">
          <div className="group">
            <input
              required="true"
              className="main-input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="highlight-span"></span>
            <label className="lebal-email">password</label>
          </div>
        </div>
        <button className="btn-following-allposts" type="submit" style={{color: "white", backgroundColor: "#28363d", marginTop:"40px"}}>
          login
        </button>
        <span style={{marginTop: "30px"}}>Don't have an account yet? <Link to={"/signup"} className="swtich" style={{color: "black"}}><b>Sign Up</b></Link></span>
      </form>
    </div>
  );
}

export default Login;
