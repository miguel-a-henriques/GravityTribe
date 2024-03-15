import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParkReviews from "../components/ParkReviews";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import L from "leaflet";
import { useRef } from "react";

const API_URL = "https://gravitytribe.onrender.com";

function ParkDetails() {
  const { id } = useParams();
  const [park, setPark] = useState("");
  const [ourUser, setOurUser] = useState({});
  const { user, isLoggedIn } = useContext(AuthContext);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [name, setName] = useState("");

  const mapRef = useRef(null); // Ref for map instance

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parks/${id}`)
      .then((response) => {
        setPark(response.data);
        setLat(response.data.location.lat);
        setLong(response.data.location.long);
        setName(response.data.name);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (lat !== "" && long !== "" && !mapRef.current) {
      mapRef.current = L.map("map").setView([lat, long], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      var marker = L.marker([lat, long]).addTo(mapRef.current);
      marker.bindPopup(`<b>${name}</b>`).openPopup();
    }
  }, [lat, long, name]);

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

  async function handleDelete(revId) {
    try {
      // Fetch the existing reviews for the park
      const response = await axios.get(`${API_URL}/api/parks/${id}`);
      const existingData = response.data;

      // Filter out the review to be deleted
      const updatedReviews = existingData.reviews.filter(
        (review) => review.revId !== revId
      );

      const updatedPark = {
        ...existingData,
        reviews: updatedReviews,
      };

      // Update the park with the new reviews array
      await axios.put(`${API_URL}/api/parks/${id}`, { updatedPark });

      const updatedParkResponse = await axios.get(`${API_URL}/api/parks/${id}`);
      setPark(updatedParkResponse.data);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  return (
    <div className="page">
      <section className="park-detail">
        <h1>{park.name}</h1>
        <br />
        <img src={park.photo} style={{width: "600px", height:"auto"}}/>
        <div id="map" style={{zIndex: "0"}}></div>
      </section>
      {/* <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg" style={{color: "white", margin: "20px"}}>Coming Soon</button> */}

      <ParkReviews updatePark={setPark} />
      <section className="park-reviews-all">
        {park && park.reviews && park.reviews.length > 0 ? (
          park.reviews.map((review, index) => (
            <section key={index} className="park-reviews">
              <div className="park-review-header">
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                <img src={review.photo} />
                <p>{review.author}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => {
                    handleDelete(review.revId);
                  }}
                >
                  <svg class="delete-svgIcon" viewBox="0 0 448 512">
                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                  </svg>
                </button>
              </div>
              <p>"{review.text}"</p>
              {review.createdBy === ourUser._id && <section></section>}
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
