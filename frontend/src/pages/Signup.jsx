import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://gravitytribe.onrender.com";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(
    "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png"
  );
  const [expLevel, setExpLevel] = useState("beginner");
  const [type, setType] = useState("athlete");

  // Initialize navigate
  const navigate = useNavigate();

  const handleChange = async (e) => {
    //Create a new form data to put all the image info
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    try {
      //Send the upload request to the backend
      const response = await axios.post(`${API_URL}/api/upload`, uploadData);
      //The backend responds with the cloudinary image url
      setPhoto(response.data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUpSubmit = (e) => {
    // Prevent Default Actions of the Form -> refresh the page.
    e.preventDefault();
    const workouts = [];
    const follow = [];
    const followedBy = [];

    const reqBody = {
      email,
      password,
      name,
      photo,
      expLevel,
      type,
      workouts,
      follow,
      followedBy,
    };

    axios
      .post(`${API_URL}/auth/signup`, reqBody)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        /* const errorDescription = error.data.message; */
        setError("Error while signing up");
        console.log(error);
      });
  };

  return (
    <div className="page">
  {/*     <h1>Sign-up Page</h1> */}
      <form onSubmit={handleSignUpSubmit} className="form" style={{gap: "30px"}}>
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
        {/*         <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}

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
        {/* <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div> */}

        <div className="group">
          <input
            required="true"
            className="main-input"
            type="text"
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="highlight-span"></span>
          <label className="lebal-email">Username</label>
        </div>
        {/*  <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div> */}
        <div>
          {/* <label>Photo</label> */}
          <input type="file" onChange={handleChange} className="file-input file-input-bordered w-full max-w-xs"/>
          {/* <img src={photo} style={{ width: "100px", height: "100px" }} /> */}
        </div>
        <div>
          <label htmlFor="experience-level"><b>Experience Level: </b></label>
          <select
            id="experience-level"
            name="experience-level"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setExpLevel(e.target.value)}
            style={{color: "#3f5e60"}}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="master">Master</option>
          </select>
        </div>
        <div>
          <label htmlFor="user-type"><b>User Type: </b></label>
          <select
            id="user-type"
            name="user-type"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setType(e.target.value)}
            style={{color: "#3f5e60"}}
          >
            <option value="athlete">Athlete</option>
            <option value="organization">Organization</option>
          </select>
        </div>
        <div>
          <button type="submit" className="btn-following-allposts" style={{color: "white", backgroundColor: "#28363d"}}>Sign Up</button>
        </div>
        {error && <p>{error}</p>}
      </form>

      {/*    <form className="form" onSubmit={handleLoginSubmit}>
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
        <button className="btn-following-allposts" type="submit" style={{color: "white", backgroundColor: "#3f5e60", marginTop:"40px"}}>
          login
        </button>
        <span style={{marginTop: "30px"}}>Don't have an account yet? <Link to={"/signup"} className="swtich" style={{color: "black"}}><b>Sign Up</b></Link></span>
      </form> */}
    </div>
  );
}

export default Signup;
