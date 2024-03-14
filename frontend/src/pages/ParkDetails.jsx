import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ParkReviews from "../components/ParkReviews";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import L from "leaflet"
import { useRef } from "react";

const API_URL = "https://gravitytribe.onrender.com";

function ParkDetails() {
  const { id } = useParams();
  const [park, setPark] = useState("");
  const [ourUser, setOurUser] = useState({});
  const { user, isLoggedIn } = useContext(AuthContext);
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")
  const [name, setName] = useState("")

  const mapRef = useRef(null); // Ref for map instance

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parks/${id}`)
      .then((response) => {
        setPark(response.data);
        setLat(response.data.location.lat)
        setLong(response.data.location.long)
        setName(response.data.name)
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
      <h2>{park.name}</h2>
      <img src={park.photo} />
      <div id="map"></div>
      <button>Coming Soon</button>

      <ParkReviews updatePark={setPark} />
      <section>
        {park && park.reviews && park.reviews.length > 0 ? (
          park.reviews.map((review, index) => (
            <section key={index}>
              <img src={review.photo} />
              <p>{review.author}</p>
              <p>{review.text}</p>
              {review.createdBy === ourUser._id && (
                <section>
                  <button
                    onClick={() => {
                      handleDelete(review.revId);
                    }}
                  >
                    Delete Comment
                  </button>
                </section>
              )}
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
