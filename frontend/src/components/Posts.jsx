import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function Posts() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [ourUser, setOurUser] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const [followPosts, setFollowPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [showFollowPosts, setShowFollowPosts] = useState(false); // State to toggle between all posts and follow posts

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
  }, [isLoggedIn, user]);

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

  useEffect(() => {
    if (isLoggedIn && ourUser && ourUser.follow) {
      setFollowPosts(
        allPosts.filter((post) =>
          ourUser.follow.some(
            (followedUser) => followedUser._id === post.userId
          )
        )
      );
    }
  }, [isLoggedIn, ourUser, allPosts, showFollowPosts]);

  const handlePost = async (e) => {
    e.preventDefault();

    const username = ourUser.name;
    const userPhoto = ourUser.photo;
    const userId = ourUser._id;
    if (ourUser) {
      try {
        const response = await axios.post(`${API_URL}/api/posts`, {
          text,
          image,
          username,
          userPhoto,
          userId,
        });

        setText("");
        setImage("");
        setAllPosts([response.data, ...allPosts]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = async (e) => {
    //Create a new form data to put all the image info
    const uploadData = new FormData();
    uploadData.append("imageUrl", e.target.files[0]);
    try {
      //Send the upload request to the backend
      const response = await axios.post(`${API_URL}/api/upload`, uploadData);
      //The backend responds with the cloudinary image url
      setImage(response.data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  };

  function handleDelete(post) {
    axios
      .delete(`${API_URL}/api/posts/${post._id}`)
      .then(() => {
        axios
          .get(`${API_URL}/api/posts`)
          .then((response) => setAllPosts(response.data))
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const toggleFollowPosts = () => {
    setShowFollowPosts(!showFollowPosts);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <form onSubmit={handlePost}>
            <label>Add Post</label>
            <input
              className="post"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div>
              <label>Photo</label>
              <input type="file" onChange={handleChange} />
              <img src={image} style={{ width: "100px", height: "100px" }} />
            </div>
            <button type="submit">Post</button>
          </form>
          <article>
            <button onClick={toggleFollowPosts}>
              {showFollowPosts ? "All Posts" : "Following"}
            </button>
            {showFollowPosts && followPosts
              ? followPosts.map((post) => (
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
                        <button onClick={() => handleDelete(post)}>
                          Delete Post
                        </button>
                      </section>
                    )}
                  </div>
                ))
              : allPosts.map((post) => (
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
                        <button onClick={() => handleDelete(post)}>
                          Delete Post
                        </button>
                      </section>
                    )}
                  </div>
                ))}
          </article>
        </div>
      ) : (
        <div> Log in to see what everyone's posting... </div>
      )}
    </div>
  );
}

export default Posts;
