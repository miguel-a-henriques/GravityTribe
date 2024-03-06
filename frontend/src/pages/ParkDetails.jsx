import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function ParkDetails() {
  const { id } = useParams;
  const [entryData, setEntryData] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/parks/${id}`)
      .then((response) => {
        setEntryData(response.data);
      })
      .catch((error) => console.log(error));
  });
  return (
    <div>
      <h2>{entryData.name}</h2>
      <img src={entryData.photo}/>
    </div>);
}

export default ParkDetails;
