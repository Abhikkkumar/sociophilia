import React, { useEffect, useState } from "react";
import "../css/home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

export default function Home() {
  const [data, setData] = useState([]);
  const loggedInUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : undefined;
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false); // 'show' decides when does comment on a post is shown;
  const [item, setItem] = useState([]);

  const notifySuccess = (message) => toast.success(message);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("in Home useEffect");
    const token = localStorage.getItem("jwt");
    if (!token) navigate("/signin");

    axios
      .get("/allPosts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((result) => {
        // console.log(result.data);
        setData(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //to toggle show comments of a post
  const toggleComment = (post) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(post);
      console.log(post);
    }
  };

  //to like a post
  const likePost = (id) => {
    axios
      .put(
        "/like",
        {
          postId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        console.log("like result:", result);
        // we are updating "data"[] so that our "home" page gets rerendered
        const newData = data.map((oldPost) => {
          //updated data of currently liked/unliked post is stored along with data of other posts in 'newData' variable
          if (oldPost._id === result.data._id) return result.data;
          else return oldPost;
        });
        setData(newData); // 'data' arr is updated
      })
      .catch((err) => console.log("like error:", err));
  };

  //to unlike a post
  const unlikePost = (id) => {
    axios
      .put(
        "/unlike",
        {
          postId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        console.log("unlike result:", result);
        // we are updating "data"[] so that our "home" page gets rerendered
        const newData = data.map((oldPost) => {
          //updated data of currently liked/unliked post is stored along with data of other posts in 'newData' variable
          if (oldPost._id === result.data._id) return result.data;
          else return oldPost;
        });
        setData(newData); // 'data' arr is updated
      })
      .catch((err) => console.log("unlike error:", err));
  };

  // to return profile-pic link for user-profile
  function decideProfilePhoto(eachPost) {
    // console.log("decideProfilePhoto() executed");

    if (
      eachPost.postedBy.photo &&
      !eachPost.postedBy.photoBlocked.includes(loggedInUserId)
    ) {
      return eachPost.postedBy.photo;
    } else {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU";
    }
  }

  // to post a comment in our database
  function postComment(text, id) {
    axios
      .put(
        "/comment",
        {
          text,
          postId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        notifySuccess("Comment posted successfully!");
        console.log("comment result:", result);
        // we are updating "data"[] so that our "home" page gets rerendered
        const newData = data.map((oldPost) => {
          //updated data of currently commented post is stored along with data of other posts in 'newData' variable
          if (oldPost._id === result.data._id) return result.data;
          else return oldPost;
        });

        setData(newData); // 'data' arr is updated
        setComment("");
      })
      .catch((err) => console.log("Comment error:", err));
  }

  return (
    <div className="s-createPost">
      <div className="home" style={{ backgroundColor: "#F5F5F5" }}>
        {/* card */}
        {data.map((eachPost) => {
          // console.log(eachPost); //eachPost.postedBy._id
          if (
            eachPost.canSee.length === 0 ||
            eachPost.canSee.includes(loggedInUserId)
          ) {
            return (
              <div className="card" key={eachPost._id}>
                {/* card-header */}
                <div className="card-header" style={{ padding: "0" }}>
                  <div className="card-pic">
                    <img
                      src={decideProfilePhoto(eachPost)}
                      alt="user-profile-img"
                    />
                  </div>
                  <Link
                    to={`/profile/${eachPost.postedBy._id}`}
                    style={{ margin: "0 10px" }}
                  >
                    <h5>{eachPost.postedBy.name}</h5>
                  </Link>
                </div>

                {/* card-image */}
                <div className="card-image">
                  <img src={eachPost.photo} alt="post-img" />
                </div>

                <div className="card-content">
                  {eachPost.likes.includes(
                    JSON.parse(localStorage.getItem("user"))._id
                  ) ? (
                    <span
                      class="material-symbols-outlined material-symbols-outlined-red"
                      onClick={() => {
                        unlikePost(eachPost._id);
                      }}
                    >
                      favorite
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined"
                      onClick={() => {
                        likePost(eachPost._id);
                      }}
                    >
                      favorite
                    </span>
                  )}
                  <p> {eachPost.likes.length} Likes</p>
                  <p>{eachPost.body}</p>
                  <p
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                    onClick={() => {
                      toggleComment(eachPost);
                    }}
                  >
                    {eachPost.comments.length === 0
                      ? `0 Comment`
                      : `View all ${eachPost.comments.length} comments`}
                  </p>
                </div>

                {/* add-comment */}
                <div className="add-comment">
                  <span className="material-symbols-outlined">mood</span>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    className="comment"
                    onClick={() => {
                      postComment(comment, eachPost._id);
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            );
          }
        })}
        {/* show Comment */}
        {show && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img src={item.photo} alt="posted-img" />
              </div>
              <div className="details" style={{ padding: "0" }}>
                {/* card-header */}
                <div
                  className="card-header cmt-header"
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #00000029",
                    height: "10%",
                  }}
                >
                  <div className="card-pic" style={{ marginRight: "5px" }}>
                    <img
                      src={
                        item.postedBy.photo
                          ? item.postedBy.photo
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU"
                      }
                      alt="user-profile-img"
                    />
                  </div>
                  <h5>{item.postedBy.name}</h5>
                  {/* <Link
                  to={`/profile/${eachPost.postedBy._id}`}
                  style={{ margin: "0 10px" }}
                >
                  <h5>{eachPost.postedBy.name}</h5>
                </Link> */}
                </div>
                <div
                  className="comment-section"
                  style={{ padding: "0", borderBottom: "1px solid #00000029" }}
                >
                  {item.comments.map((comment) => {
                    return (
                      <p className="comm">
                        <span
                          className="commenter"
                          style={{ fontWeight: "bolder" }}
                        >
                          {`${comment.postedBy.name} `}
                        </span>
                        <span className="commentText">{comment.comment}</span>
                      </p>
                    );
                  })}
                </div>
                <div className="card-content">
                  <p> {item.likes.length} Likes</p>
                  <p>{item.body}</p>
                </div>
                {/* add-comment */}
                <div className="add-comment">
                  <span className="material-symbols-outlined">mood</span>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <button
                    className="comment"
                    onClick={() => {
                      postComment(comment, item._id);
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            <div className="close-comment">
              <span
                class="material-symbols-outlined material-symbols-outlined-closed"
                onClick={() => {
                  toggleComment();
                }}
              >
                close
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
