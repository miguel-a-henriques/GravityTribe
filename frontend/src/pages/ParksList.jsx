import React, { useEffect } from "react";
import ParkCard from "../components/ParkCard";
import { useState } from "react";
import axios from "axios";

const API_URL = "https://gravitytribe.onrender.com";

function ParksList() {
  const [parks, setParks] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parks`)
      .then((response) => {
        setParks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching park:", error);
      });
  }, []);
  return (
    <div className="page parks-page">
      <div>
        {parks.map((entry) => (
          <ParkCard key={entry._id} entry={entry} id={entry._id} />
        ))}
      </div>
    </div>
  );
}

export default ParksList;
