import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/following.css";

export default function Following({
  searchValue,
  setSearchValue,
  setShowSearch,
}) {
  const navigate = useNavigate();
  const [matchList, setMatchList] = useState([]);
  const loggedInUserId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))._id
    : undefined;

  function findUsers() {
    searchValue = searchValue.toLowerCase().trim().replaceAll(/\s+/g, "-");
    axios
      .get(`/findByName/${searchValue}`)
      .then((result) => {
        console.log(result.data);
        setMatchList(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (searchValue) findUsers();
  }, [searchValue]);

  // to return profile-pic link for user-profile
  function decideProfilePhoto(profile) {
    // console.log("decideProfilePhoto() executed");

    if (profile.photo && !profile.photoBlocked.includes(loggedInUserId)) {
      return profile.photo;
    } else {
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU";
    }
  }

  return (
    <div
      className="darkBg"
      onClick={() => {
        setSearchValue("");
        setShowSearch(false);
      }}
    >
      <div className="following-centered">
        <div className="following">
          {matchList.length === 0 ? (
            <h4>No User found!</h4>
          ) : (
            <>
              <h4>Search Result</h4>
              <div className="list-body">
                {matchList.map((profile, index) => (
                  <div
                    className="list-item"
                    style={{ color: "black", cursor: "pointer" }}
                    key={index}
                    onClick={() => {
                      navigate(`/profile/${profile._id}`);
                    }}
                  >
                    <img
                      src={decideProfilePhoto(profile)}
                      alt="followers-profile-pic"
                    />
                    <p>{profile.name}</p>
                  </div>
                ))}
              </div>{" "}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
