import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";


function EditProfile() {

const {id} = useParams();

const [ourUser, setOurUser] = useState();
const { user, isLoggedIn } = useContext(AuthContext);

// Initialize navigate
const navigate = useNavigate();

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

const handleChange = (e) => {
  setPhoto(URL.createObjectURL(e.target.files[0]));
};

const handleSignUpSubmit = (e) => {
  // Prevent Default Actions of the Form -> refresh the page.
  e.preventDefault();

  const reqBody = { email, password, name, photo, expLevel };

  axios
    .put(`${API_URL}/user/${id}`, reqBody)
    .then(() => {
      navigate("/userprofile");
    })
    .catch((error) => {
      /* const errorDescription = error.data.message; */
     setError("Error while editing profile")
     console.log(error)
    });
};

const [email, setEmail] = useState(ourUser.email);
const [password, setPassword] = useState("");
const [name, setName] = useState(ourUser.name);
const [error, setError] = useState("");
const [photo, setPhoto] = useState(ourUser.photo);
const [expLevel, setExpLevel] = useState(ourUser.expLevel)

    return (
        <div>
            {isLoggedIn && ourUser ? (
                <div>
                <h1>Edit My Profile</h1>
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
                    <button type="submit">Push Profile</button>
                  </div>
                  {error && <p>{error}</p>}
                </form>
                </div>
            ) : (<h1>Please Log In to edit Profile</h1>)}
            
        </div>
    )
}

export default EditProfile;