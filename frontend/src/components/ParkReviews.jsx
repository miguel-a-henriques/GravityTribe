import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function ParkReviews () {

    const [review, setReview] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            // Fetch the existing reviews for the park
            const response = await axios.get(`${API_URL}/api/parks/${id}`);
            const existingData = response.data;

            // Add the new review to the existing array
            const updatedData = {
                ...existingData,
                reviews: [
                    ...(existingData.review || []),
                    review
                ]
            };

            await axios.put(`${API_URL}/api/parks/${id}`, updatedData);

            // After successfully updating, navigate to the planet page
            navigate(`/parkdetails/${id}`);
        } catch (error) {
            console.error("Error adding review:", error);
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Add Review</label>
                <input className="review" type="text" value={review} onChange={(e) => setReview(e.target.value)} />
                <button type="submit">Push your review</button>
            </form>
        </div>
    )
}

export default ParkReviews;