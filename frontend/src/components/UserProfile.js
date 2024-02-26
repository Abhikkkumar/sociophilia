import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import "../css/profile.css";
import { useParams } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import ProfilePic from "../components/ProfilePic";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const UserProfile = () => {
  const { userid } = useParams();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(""); //'user' stores all personal info about the user
  const [posts, setPosts] = useState([]); //'posts' stores all posts related info about the user
  const [isFollowed, setIsFollowed] = useState(false); //it stores if a user is followed by 'signed in' user
  const [listName, setListName] = useState("");
  const { setShowConnection, setUserConnectionData } = useContext(LoginContext); // to use 'setShowFollowing' in 'userProfile'
  const [changePic, setChangePics] = useState(false); //'changePic' decides when to present 'ProfilePic' file
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    axios
      .get(`/user/${userid}`)
      .then((result) => {
        // console.log(result.data);
        setUser(result.data.user);
        setPosts(result.data.posts);
        //if listName is not empty then set connectionData
        if (listName) {
          // console.log(user);

          if (
            listName === "followers" &&
            user.followersBlocked.includes(loggedUser._id)
          ) {
            notifyError(`Followers list is locked by the User.`);
            setListName("");
          } else if (
            listName === "following" &&
            user.followingBlocked.includes(loggedUser._id)
          ) {
            notifyError(`Following list is locked by the User.`);
            setListName("");
          } else {
            const connectionData = {
              listName,
              list: result.data.user[listName],
            };
            setUserConnectionData(connectionData);
            if (connectionData.list) {
              // console.log("connectionData", connectionData);
              setShowConnection(true);
              setListName("");
            }
          }
        }

        //if 'user' is followed, then set 'isFollowed' true else false
        if (result.data.user.followers.includes(loggedUser._id)) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      })
      .catch((err) => console.log(err));
  }, [isFollowed, listName, userid]);

  function changeProfile() {
    if (userid === loggedUser._id) {
      if (changePic) setChangePics(false);
      else setChangePics(true);
    }
  }

  //to follow a user
  function followUser(userId) {
    axios
      .put(
        "/follow",
        {
          followId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        console.log("success in follow:", result);
        setIsFollowed(true);
      })
      .catch((err) => console.log("err in follow:", err));
  }

  //to unfollow a user
  function unfollowUser(userId) {
    axios
      .put(
        "/unfollow",
        {
          followId: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        console.log("success in unfollow:", result);
        setIsFollowed(false);
      })
      .catch((err) => console.log("err in unfollow:", err));
  }

  //to set whether the list name is 'followers' or 'following'
  function setHeading(e) {
    if (e.target.innerText.includes("Followers")) setListName("followers");
    else setListName("following");
  }

  // to return profile-pic link for user-profile
  function decideProfilePhoto() {
    // console.log("decideProfilePhoto() executed");

    if (user.photo && !user.photoBlocked.includes(loggedUser._id)) {
      return user.photo;
    } else {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU";
    }
  }

  return (
    <div className="s-createPost">
      <div className="profile">
        {/* profile-frame */}
        <div className="profile-frame">
          {/* profile-pic */}
          <div className="profile-pic">
            <img
              src={decideProfilePhoto()}
              alt="profile-pic"
              onClick={() => {
                changeProfile();
              }}
            />
          </div>

          {/* profile-data */}
          <div className="profile-data">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {userid !== loggedUser._id ? (
                <>
                  <h1>{user.name}</h1>
                  <button
                    className="followBtn"
                    onClick={() => {
                      isFollowed ? unfollowUser(userid) : followUser(userid);
                    }}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </>
              ) : (
                <h1>{user.name} (You)</h1>
              )}
            </div>

            <div className="profile-info">
              <p>{posts.length} posts</p>
              <p
                onClick={(e) => {
                  setHeading(e);
                }}
                style={{ cursor: "pointer" }}
              >
                {user.followers ? user.followers.length : 0} Followers
              </p>
              <p
                onClick={(e) => {
                  setHeading(e);
                }}
                style={{ cursor: "pointer" }}
              >
                {user.following ? user.following.length : 0} Following
              </p>
            </div>
          </div>
        </div>
        <hr style={{ width: "90%", opacity: "0.8", margin: "20px auto" }} />

        {/* Gallery */}
        <div className="gallery">
          {posts.map((eachPost) => {
            return (
              <img key={eachPost._id} src={eachPost.photo} alt="profile-pic" />
            );
          })}
        </div>
        {/* <Following /> */}
        {changePic && <ProfilePic changeProfile={changeProfile} />}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
