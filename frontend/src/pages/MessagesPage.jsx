import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";

const API_URL = "https://gravitytribe.onrender.com";

function MessagesPage () {

    const { id } = useParams();
    const [thisUser, setThisUser] = useState({});
    const { user, isLoggedIn } = useContext(AuthContext);
    const [ourUser, setOurUser] = useState();
    const [allMessages,setAllMessages] = useState();
    const [text, setText] = useState();

    useEffect(() => {
        axios
          .get(`${API_URL}/api/user/${id}`)
          .then((response) => {
            setThisUser(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, [id]);

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

      useEffect(() => {
        if(isLoggedIn && ourUser && thisUser) {
            axios
            .get(`${API_URL}/api/messages?ourUserId=${ourUser._id}&thisUserId=${thisUser._id}`)
            .then((response) => {
                setAllMessages(response.data);
            })
            .catch((error) => console.log(error.response ? error.response.data : error))
        }
    }, [isLoggedIn, ourUser, thisUser])

    const sendMessage = (e) => {
        e.preventDefault();
    
        axios
            .post(`${API_URL}/api/messages`, {
                text: text,
                sentTo: { nameTo: thisUser.name, idTo: thisUser._id },
                sentFrom: { nameFrom: ourUser.name, idFrom: ourUser._id }
            })
            .then((response) => {
                setAllMessages([...allMessages, response.data]);
                setText('');
            })
            .catch((error) => console.log(error.response ? error.response.data : error));
        
        setText("")
    };
    

    return (
        <div className="page">
            <section className="" style={{marginTop:100}}>
                {isLoggedIn && ourUser && thisUser && allMessages ? (
                    allMessages.map((message) => {
                        const isSentByUser = message.sentFrom.idFrom === ourUser._id;
                        return(
                        <article key={message._id}>
                            <div style={{padding: "10px", backgroundColor: isSentByUser ? "lightgray" : "#3f5e60", margin: 10, width: 300, borderRadius:20, color: isSentByUser ? "black" : "white"}}>
                            <p><b>{message.sentFrom.nameFrom}</b></p>
                            <p style={{fontSize: "20px"}}>{message.text}</p>
                            </div>
                        </article>
                        )
                    })
                ) : ("You haven't talked with this person yet")}
            </section>
            <section >
                <form type="submit" className="message-form">
                    <textarea className="textarea textarea-bordered" value={text} name="message" placeholder="Write your message" style={{margin: 5}} onChange={(e) => setText(e.target.value)}></textarea>
                    <button className="btn-send-message" onClick={sendMessage}>Send</button>
                </form>
            </section>
        </div>
    )
}

export default MessagesPage;