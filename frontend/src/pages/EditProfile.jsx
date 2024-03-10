import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function EditProfile() {
  const { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState("");
  const [expLevel, setExpLevel] = useState("");

  /*  ---------------------------------------------------------------------

  Comentarios para esta página:
  - as alterações deviam ser apenas para nome, foto e expLevel
  - temos de alterar a parte do delete review para ir buscar o id, e nao o nome,
  isto porque senão nao podemos apagar o comentario pós mudança do nome (acho eu).

  -------------------------------------------------------------------------- */

  // Initialize navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/user/${user._id}`)
        .then((response) => {
          setOurUser(response.data);
          setEmail(response.data.email);
          setName(response.data.name);
          setPhoto(response.data.photo);
          setExpLevel(response.data.expLevel);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn, user]);

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
        setError("Error while editing profile");
        console.log(error);
      });
  };

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
