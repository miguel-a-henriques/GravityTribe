import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";

const API_URL = "https://gravitytribe.onrender.com";

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

  const sortedPosts = allPosts.sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="page">
      {isLoggedIn ? (
        <div>
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h1>See what's new ...</h1>
            <button
              className="btn-following-allposts"
              onClick={toggleFollowPosts}
            >
              {showFollowPosts ? "Following" : "All Posts"}
            </button>
          </section>
          <section className="post-add">
            <details className="dropdown">
              <summary
                className="m-1 btn"
                style={{ color: "white", backgroundColor: "#3f5e60" }}
              >
                Add Post
              </summary>

              <form
                onSubmit={handlePost}
                className="post-add p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"
              >
                <input
                  className="input input-bordered w-full max-w-xs"
                  type="text"
                  style={{ color: "#3f5e60" }}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  onChange={handleChange}
                />
                {/* <img src={image} style={{ width: "100px", height: "100px" }} /> */}
                <button
                  className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                  type="submit"
                >
                  Post
                </button>
              </form>
            </details>
          </section>

          <article>
            {showFollowPosts && followPosts
              ? followPosts.map((post) => (
                  <div key={post._id} className="post">
                    <article>
                      <div className="post-header">
                        <Link to={`/profile/${post.userId}`}>
                          <img
                            src={post.userPhoto}
                            style={{ height: "50px", width: "50px" }}
                          ></img>
                        </Link>
                        <Link to={`/profi/${post.userId}`}>
                          <p style={{ color: "black" }}>{post.username}</p>
                        </Link>
                      </div>
                      <img src={post.image} className="post-img" />
                      <p className="post-text">{post.text}</p>
                    </article>
                    {post.userId === ourUser._id && (
                      <section>
                        <button className="delete-button" onClick={() => handleDelete(post)}>
                        <svg class="delete-svgIcon" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                          </svg>
                        </button>
                      </section>
                    )}
                  </div>
                ))
              : allPosts.map((post) => (
                  <div key={post._id} className="post">
                    <article>
                      <div className="post-header">
                        <Link to={`/profile/${post.userId}`}>
                          <img
                            src={post.userPhoto}
                            style={{ height: "50px", width: "50px" }}
                          ></img>
                        </Link>
                        <Link to={`/profile/${post.userId}`}>
                          <p style={{ color: "black" }}>{post.username}</p>
                        </Link>
                      </div>
                      <img src={post.image} className="post-img" />
                      <p className="post-text">{post.text}</p>
                    </article>
                    {post.userId === ourUser._id && (
                      <section className="del-btn">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(post)}
                        >
                          <svg class="delete-svgIcon" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                          </svg>
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
