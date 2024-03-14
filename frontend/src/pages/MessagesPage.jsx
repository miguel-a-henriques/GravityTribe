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
            <section className="chat-box">
                {isLoggedIn && ourUser && thisUser && allMessages ? (
                    allMessages.map((message) => {
                        return(
                        <article key={message._id}>
                            <p style={{fontSize: "20px"}}>{message.text}</p>
                            <p>{message.sentFrom.nameFrom}</p>
                        </article>
                        )
                    })
                ) : ("You haven't talked with this person yet")}
            </section>
            <section className="message-form">
                <form type="submit">
                    <input type="text" value={text} name="message" placeholder="Write your message" onChange={(e) => setText(e.target.value)}></input>
                    <button type="submit" onClick={sendMessage}>Send</button>
                </form>
            </section>
        </div>
    )
}

export default MessagesPage;