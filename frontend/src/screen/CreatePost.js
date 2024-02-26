import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/createPost.css";
import axios from "axios";
import { toast } from "react-toastify";
import LimitedSharing from "../components/LimitedSharing.js";
import Footer from "../components/Footer";

export default function CreatePost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [limitShare, setLimitShare] = useState(false);
  const [allowedUser, setAllowedUser] = useState([]);

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const navigate = useNavigate();

  useEffect(() => {
    //if 'url' is not empty, then create 'dataToDb' and execute 'saveToDb'
    if (url) {
      const dataToDb = {
        caption: body,
        photo: url,
        canSee: allowedUser,
      };

      //function to save data to Db
      async function saveToDb(dataToDb) {
        // console.log("saveToDb() is running.");

        try {
          const result = await axios.post("/createPost", dataToDb, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          });
          notifySuccess(result.data.message);
          if (url) setUrl("");
          navigate("/");
          // console.log("successfully posted data to Db()", result);
        } catch (err) {
          notifyError(err.response.data.error);
          console.log("error in saveToDb()", err);
        }
      }
      if (url) saveToDb(dataToDb);
    }
  }, [url, body, navigate]);

  async function postData() {
    //uploading data to cloudinary
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "munnabhi");
    try {
      const result = await axios.post(
        "https://api.cloudinary.com/v1_1/munnabhi/image/upload",
        data
      );
      setUrl(result.data.url);
      console.log(result.data.url);
    } catch (err) {
      notifyError("Please fill all the fields!");
      // console.log("err in posting data to cloudinary", err);
    }
  }

  const loadFile = (event) => {
    var output = document.querySelector("#output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); //free memory
    };
  };

  return (
    <div className="s-createPost">
      <div className="createPost">
        <div className="post-header">
          <button
            id="l-post-btn"
            className="post-btn"
            onClick={() => {
              setLimitShare(true);
            }}
          >
            Limited Share
          </button>
          <h4>Create new post</h4>
          <button
            id="post-btn"
            className="post-btn"
            onClick={() => {
              postData();
              // console.log("papaya");
            }}
          >
            Share To All
          </button>
        </div>

        <div className="main-div">
          <img
            id="output"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png"
            alt="selected-img-preview"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              loadFile(event);
              setImage(event.target.files[0]);
            }}
          />
        </div>

        <div className="share-details">
          <div className="card-header">
            <div className="card-pic">
              <img
                src={
                  JSON.parse(localStorage.getItem("user")).photo
                    ? JSON.parse(localStorage.getItem("user")).photo
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAOWugjv2va31k9P7BfE-vQ47mcaMV7idM9g&usqp=CAU"
                }
                alt="user-profile-pic"
              />
            </div>
            <h5>{JSON.parse(localStorage.getItem("user")).name}</h5>
          </div>
          <textarea
            value={body}
            type="text"
            placeholder="Write a caption..."
            onChange={(event) => {
              setBody(event.target.value);
            }}
          ></textarea>
        </div>
        {limitShare && (
          <LimitedSharing
            postData={postData}
            setLimitShare={setLimitShare}
            setAllowedUser={setAllowedUser}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
