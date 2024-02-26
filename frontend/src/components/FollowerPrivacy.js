import axios from "axios";
import React, { useState } from "react";
import "../css/followingPrivacy.css";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function FollowerPrivacy({ setShowFollowerPrivacy }) {
  const [datas, setDatas] = useState([]);
  const [locked, setLocked] = useState([]);

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  //to get followersBlocked data of current logged in user
  function currentUserData() {
    // console.log("currentUserData()");
    axios
      .get(
        `/user/${
          JSON.parse(localStorage.getItem("user"))._id
        }`
      )
      .then((result) => {
        setLocked(result.data.user.followersBlocked);
      })
      .catch((err) => console.log(err));
  }
  if (locked.length === 0) currentUserData();

  // to get data of all registered users
  function getAllUsers() {
    axios
      .get("/allUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((result) => {
        setDatas(result.data);
      })
      .catch((err) => console.log(err));
  }
  if (datas.length === 0) getAllUsers();

  // function to take data of each user as input and print it
  function printData(data, index) {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    //A user can't lock himself
    if(data._id===loggedInUser._id)
      return "";
    let isLocked = false;
    if (locked.includes(data._id)) {
      isLocked = true;
    }

    return (
      <div className="list-item t-p-a-list" key={index}>
        <div className="f-p-list-data" style={{ color: "black" }}>
          <img
            src={
              data.photo && !data.photoBlocked.includes(loggedInUser._id)
                ? data.photo
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU"
            }
            alt="followers-profile-pic"
            className="followers-profile-pic"
          />
          <p>{data.name}</p>
        </div>
        {isLocked ? (
          <button
            className="blockBtn primaryBtn"
            value={data._id}
            onClick={(e) => unlockUser(e.target.value)}
            style={{backgroundColor:"#338236"}}
          >
            Unlock
          </button>
        ) : (
          <button
            className="blockBtn primaryBtn"
            value={data._id}
            onClick={(e) => lockUser(e.target.value)}
          >
            Lock
          </button>
        )}
      </div>
    );
  }
 

  function lockUser(userId) {
    axios
      .put(
        "/lockUser",
        {
          location: "followersBlocked",
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        // console.log(result.data);
        notifySuccess("User Locked Successfully!");
        currentUserData();
      })
      .catch((err) => {
        notifyError("Locking Failed! Please try again.");
        console.log("Error in Locking", err);
      });
  }

  function unlockUser(userId) {
    axios
      .put(
        "/unlockUser",
        {
          location: "followersBlocked",
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        // console.log(result.data);
        notifySuccess("User Unlocked Successfully!");
        currentUserData();
      })
      .catch((err) => {
        notifyError("Unlocking Failed! Please try again.");
        console.log("Error in unlock", err);
      });
  }

  return (
    <div className="darkBg">
      <div className="lmt-shr-centered">
        <div className="limited-sharing">
          <h4>My Followers List Privacy</h4>
          <button
            style={{ backgroundColor: "red" }}
            className="closeBtn"
            onClick={() => {
              setShowFollowerPrivacy(false);
            }}
          >
            <RiCloseLine></RiCloseLine>
          </button>
          <div className="list-body" style={{ maxHeight: "50vh" }}>
            {datas.map((data, index) => {
              return printData(data, index);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
