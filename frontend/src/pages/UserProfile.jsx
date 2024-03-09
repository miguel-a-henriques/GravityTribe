import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";


const API_URL = "http://localhost:5005";


function UserProfile() {

    const { user, isLoggedIn } = useContext(AuthContext);
    const [ourUser, setOurUser] = useState({});



    useEffect(()=>{
        axios.get(`${API_URL}/api/user/${user._id}`)
        .then((response)=>{
            setOurUser(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])

    return (
        <div>
            <h2>{ourUser.name}</h2>
        </div>
    )
}

export default UserProfile;