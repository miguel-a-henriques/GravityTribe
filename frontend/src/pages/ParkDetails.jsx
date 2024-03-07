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
              <button>
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
