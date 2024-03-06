import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  }, [id]);
  return (
    <div>
      <h2>{park.name}</h2>
      <img src={park.photo}/>
    </div>);
}

export default ParkDetails;
