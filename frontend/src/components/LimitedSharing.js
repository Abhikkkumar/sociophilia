import axios from "axios";
import React, { useState, useEffect } from "react";

import { RiCloseLine } from "react-icons/ri";
import "../css/limitedSharing.css";

export default function LimitedSharing({ postData, setLimitShare, setAllowedUser }) {
  const [users, setUsers] = useState([]);
  const currentLoggedInUser = JSON.parse(localStorage.getItem("user"))._id;
  
  const temp = [];

  function loadAllUser() {
    console.log("loadAllUser", users);
    axios
      .get("/allUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((result) => {
        setUsers(result.data);
      })
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    if (users.length === 0) loadAllUser();
  }, [users]);


  function presentUser(user, index) {
    return (
      <div className="list-item t-p-a-list" key={index}>
        <img
          src={
            user.photo
              ? user.photo
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU"
          }
          alt="followers-profile-pic"
          className="followers-profile-pic"
        />
        <p>{user.name}</p>
        <button
          className="revokeBtn"
          value={user._id}
          onClick={(e) => changeText(e)}
        >
          Add To Show Post
        </button>
      </div>
    );
  }

  function changeText(event) {
    temp.push(event.target.value)
    // console.log(temp);
    // console.log(event.target.value);
    
    if (event.target.innerText === "Add To Show Post")
      event.target.textContent = "Added To Show Post";
    else {
      event.target.textContent = "Add To Show Post";
    }
  }

  return (
    <div className="darkBg">
      <div className="lmt-shr-centered">
        <div className="limited-sharing">
          <h4>Limited Sharing Settings</h4>
          <button
            style={{ backgroundColor: "red" }}
            className="closeBtn"
            onClick={() => setLimitShare(false)}
          >
            <RiCloseLine></RiCloseLine>
          </button>
          <div className="list-body" style={{maxHeight: "50vh"}}>
            <div className="list-item t-p-a-list">
              <button
                className="l-share-btn"
                onClick={() => {
                    const followers = JSON.parse(localStorage.getItem("user")).followers;
                  setAllowedUser(
                    [...followers, currentLoggedInUser]
                  );
                  postData();
                  setLimitShare(false);
                }}
              >
                Click To Share To Your Followers
              </button>
            </div>
            <div className="list-item t-p-a-list">
              <button
                className="l-share-btn "
                onClick={() => {
                  setAllowedUser(
                    [...temp, currentLoggedInUser]
                  );
                  postData();
                  setLimitShare(false);
                }}
              >
                Click To Share To Selected Users
              </button>
            </div>
            {users.map((user, index) => {
              return presentUser(user, index);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
