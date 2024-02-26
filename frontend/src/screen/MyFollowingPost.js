import React, { useEffect, useState } from "react";
import "../css/home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

export default function MyFollowingPost() {
  const [data, setData] = useState([]);
  const loggedInUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : undefined;

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("in myFollowingPost useEffect");
    const token = localStorage.getItem("jwt");
    if (!token) navigate("/signin");

    axios
      .get("/myfollowingpost", {
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

  return (
    <div className="s-createPost">
      <div className="home" style={{ backgroundColor: "#F5F5F5" }}>
        {/* card */}
        {data.map((eachPost) => {
          // console.log(eachPost);  //eachPost.postedBy._id
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
              </div>

              {/* add-comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input type="text" placeholder="Add a comment" />
                <button className="comment">Post</button>
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}
