import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/profile.css";
import ProfilePic from "../components/ProfilePic";

const Profile = () => {
  
  const [changePic, setChangePics] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((result) => {
        console.log(result.data);
        setUser(result.data.user);
        setPosts(result.data.posts);
      })
      .catch((err) => console.log(err));
  }, []);

  function changeProfile() {
    if (changePic) setChangePics(false);
    else setChangePics(true);
  }

  return (
    <div className="profile">
      {/* profile-frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img
            onClick={() => {
              changeProfile();
            }}
            src={user.photo?user.photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU"}
            alt="profile-pic"
          />
        </div>

        {/* profile-data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{posts.length} posts</p>
            <p onClick={(e)=>{console.log(e.target.innerText.includes("Follower"))}}>{(user.followers )? user.followers.length : 0} Followers</p>
            <p>{(user.following )? user.following.length: 0} Following</p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "20px auto" }} />

      {/* Gallery */}
      <div className="gallery">
        {posts.map((eachPost) => {
          return (
            <img key={eachPost._id} src={eachPost.photo} alt="posts" />
          );
        })}
      </div>
      {changePic && <ProfilePic changeProfile={changeProfile} />}
    </div>
  );
};

export default Profile;
