import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParkReviews from "../components/ParkReviews";

const API_URL = "http://localhost:5005";

function ParkDetails() {
  const { id } = useParams();
  const [park, setPark] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parks/${id}`)
      .then((response) => {
        setPark(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  async function deleteReview(reviewIdToDelete) {
    try {
      // Fetch the existing park data
      const response = await axios.get(`${API_URL}/api/parks/${id}`);
      const existingData = response.data;

      // Filter out the review with the specified ID
      const updatedReviews = existingData.reviews.filter(
        (review) => review.revId !== reviewIdToDelete
      );

      // Update the reviews in the park data
      existingData.reviews = updatedReviews;

      // Update the park data on the server
      await axios.put(`${API_URL}/api/parks/${id}`, existingData);

      // Fetch the updated park data
      const updatedParkResponse = await axios.get(`${API_URL}/api/parks/${id}`);
      setPark(updatedParkResponse.data);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

/*   async function deleteReview(reviewIdToDelete) {
    try {
      // Delete the review
      await axios.delete(`${API_URL}/api/parks/${id}`, {
        data: { revId: reviewIdToDelete } // Pass reviewIdToDelete in request body
      });
  
      // After deleting, fetch the updated park data
      const updatedParkResponse = await axios.get(`${API_URL}/api/parks/${id}`);
      setPark(updatedParkResponse.data);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  } */

  return (
    <div>
      <h2>{park.name}</h2>
      <img src={park.photo} />

      <ParkReviews updatePark={setPark} />
      <section>
        {park && park.reviews && park.reviews.length > 0 ? (
          park.reviews.map((review, index) => (
            <section key={index}>
              <img src={review.photo} />
              <p>{review.author}</p>
              <p>{review.text}</p>
              <button onClick={() => deleteReview(review.revId)}>
                Delete Comment
              </button>
            </section>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </section>
    </div>
  );
}

export default ParkDetails;
