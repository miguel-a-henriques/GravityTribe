import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = "http://localhost:5005";
import axios from "axios";

function Profile() {

    const [user, setUser] = useState([])
    const {id} = useParams()

    useEffect(()=>{
        axios.get(`${API_URL}/api/user/${id}`)
        .then((response)=>{
            setUser(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[id])

    return (
        <div>
            <h2>{user.name}</h2>
        </div>
    )
}

export default Profile;