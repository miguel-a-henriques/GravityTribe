import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useEffect } from "react";

const API_URL = "https://gravitytribe.onrender.com";

function ParkReviews(props) {
  const [text, setText] = useState("");
  const { id } = useParams();
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const { updatePark } = props;

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Fetch the existing reviews for the park
      const response = await axios.get(`${API_URL}/api/parks/${id}`);
      const existingData = response.data;

      const review = {text: text, author: ourUser.name, createdBy: ourUser._id, photo: ourUser.photo, revId: Math.random().toString(36).substr(2, 9)}

      // Add the new review to the existing array
      const updatedPark = {
        ...existingData,
        reviews: [...(existingData.reviews || []), review],
      };

      await axios.put(`${API_URL}/api/parks/${id}`, {updatedPark});

      const updatedParkResponse = await axios.get(`${API_URL}/api/parks/${id}`);
      updatePark(updatedParkResponse.data);

      setText("")
    } catch (error) {
      console.error("Error adding review:", error);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <label>Add Review</label>
          <input
            className="review"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Push your review</button>
        </form>
      ) : (
        <div />
      )}
    </div>
  );
}

export default ParkReviews;
