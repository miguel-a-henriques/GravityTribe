import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "https://gravitytribe.onrender.com";

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
      /* window.location.reload(); */
  };

  return (
    <div className="page">
      {isLoggedIn && ourUser ? (
        <div style={{marginTop: "50px",marginBottom:"40px", display: "flex", alignItems:"center", flexDirection: "column"}}>
          <h1 style={{marginLeft: "100px"}}>Edit My Profile</h1>
          <form onSubmit={handleSignUpSubmit}>
            <div style={{paddingTop: "50px", paddingBottom:"50px"}}>
            
              <label style={{fontSize: "1.5em"}}>Username: </label>
              <input
                type="text"
                name="username"
                className="input input-bordered w-full max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <br></br>
            <br></br>
            <div style={{display: "flex", alignItems:"center", flexDirection: "column", gap:"10px"}}>
              <input type="file" className="file-input w-full max-w-xs" onChange={handleChange} />
              <img src={photo} style={{ width: "150px", height: "auto" }} />
            </div>
            <br></br>
            <br></br>
            <div>
              <label htmlFor="experience-level" style={{fontSize: "1.5em"}}>Experience Level: </label>
              <select
              className="select select-bordered w-full max-w-xs"
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
            <div style={{marginTop: "20px", display: "flex", flexDirection:"column", alignItems:"center"}}>
              <button className="btn-following-allposts"
                style={{
                  color: "white",
                  backgroundColor: "#28363d",
                  marginTop: "40px",
                }} type="submit">Push Profile</button>
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
