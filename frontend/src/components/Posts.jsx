import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function Posts() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState("");

  const [allPosts, setAllPosts] = useState([]);
  const [followPosts, setFollowPosts] = useState();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

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
    if (isLoggedIn) {
      axios
        .get(`${API_URL}/api/posts`)
        .then((response) => {
          setAllPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  const handlePost = (e) => {
    e.preventDefault();

    const username = ourUser.name;
    const userPhoto = ourUser.photo;
    const userId = ourUser._id;

    axios
      .post(`${API_URL}/api/posts`, {
        text,
        image,
        username,
        userPhoto,
        userId,
      })
      .then((response) => {
        setText("");
        setAllPosts([response.data, ...allPosts]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleDelete(post) {
    axios.delete(`${API_URL}/api/posts/${post._id}`)
    .then(() => {
      axios.get(`${API_URL}/api/posts`)
      .then((response) => setAllPosts(response.data))
      .catch((error)=>{console.log(error)})
    })
    .catch((error)=>{
      console.log(error)
    })
  };

  return (
    <div>
      {isLoggedIn ? (
        /* Form to create a new post */
        <div>
          <form onSubmit={handlePost}>
            <label>Add Post</label>
            <input
              className="post"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
          <article>
            {/*  Posts mapping  */}
            <button>World</button>
            {allPosts
              ? allPosts.map((post) => {
                  return (
                    <div key={post._id}>
                      <article>
                        <img src={post.image} alt="" />
                        <p>{post.text}</p>
                        <img
                          src={post.userPhoto}
                          style={{ height: "20px", width: "20px" }}
                        ></img>
                        <p>{post.username}</p>
                      </article>
                      {post.userId === ourUser._id && (
                        <section>
                          <button onClick={()=>handleDelete(post)}>
                            Delete Post
                          </button>
                        </section>
                      )}
                    </div>
                  );
                })
              : "No posts to see"}
            <button>Following</button>
          </article>
        </div>
      ) : (
        <div> Log in to see what everyone's posting... </div>
      )}
    </div>
  );
}

export default Posts;