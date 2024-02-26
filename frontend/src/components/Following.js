import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/following.css";

export default function Following({ setShowConnection, userConnectionData }) {
  const navigate = useNavigate();
  const [fList, setFList] = useState([]);
  const loggedInUserId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))._id
  : undefined;

  useEffect(() => {
    if (userConnectionData.list.length !== 0) {
      const fetchData = async () => {
        const promises = userConnectionData.list.map((eachFollower) =>
          axios.get(`/user/${eachFollower}`)
        );

        try {
          const results = await Promise.all(promises);
          const updatedFList = results.map((result) => ({
            _id:result.data.user._id,
            photo: result.data.user.photo,
            name: result.data.user.name,
            photoBlocked:result.data.user.photoBlocked
          }));
          setFList(updatedFList);
        } catch (err) {
          console.log(err);
        }
      };

      fetchData();
    }
  }, [userConnectionData.list]);


   // to return profile-pic link for user-profile
   function decideProfilePhoto(profile) {
    // console.log("decideProfilePhoto() executed");
    

    if (
      profile.photo &&
      !profile.photoBlocked.includes(loggedInUserId)
    ) {
      return profile.photo;
    } else {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU";
    }
  }

  return (
    <div
      className="darkBg"
      onClick={() => {
        setShowConnection(false);
      }}
    >
      <div className="following-centered">
        <div className="following">
          <h4>{`F${userConnectionData.listName.slice(1)}`}</h4>
          <div className="list-body">
            {fList.map((profile, index) => (
              <div className="list-item" style={{ color: "black", cursor:"pointer"}} key={index} onClick={()=>{
                navigate(`/profile/${profile._id}`)
              }}>
                <img
                  src={
                    decideProfilePhoto(profile)
                  }
                  alt="followers-profile-pic"
                />
                <p>{profile.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
