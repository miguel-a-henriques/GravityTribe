import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function EditProfile() {
  const { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);

  const [ourUser, setOurUser] = useState();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/user/${user._id}`)
        .then((response) => {
          setOurUser(response.data);
          setName(response.data.name);
          setPhoto(response.data.photo);
          setExpLevel(response.data.expLevel);
          setEmail(response.data.email);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn, user]);

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
    e.preventDefault();

    const reqBody = { email, name, photo, expLevel };

    axios
      .put(`${API_URL}/api/user/${id}`, reqBody)
      .then(() => {
        navigate("/userprofile");
      })
      .catch((error) => {
        setError("Error while editing profile");
        console.log(error);
      });
      window.location.reload();
  };

  return (
    <div className="page">
      {isLoggedIn && ourUser ? (
        <div>
          <h1>Edit My Profile</h1>
          <form onSubmit={handleSignUpSubmit}>
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
              <select
                id="experience-level"
                name="experience-level"
                onChange={(e) => setExpLevel(e.target.value)}
              >
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
      ) : (
        <h1>Please Log In to edit Profile</h1>
      )}
    </div>
  );
}

export default EditProfile;
