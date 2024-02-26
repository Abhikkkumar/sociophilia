import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ProfilePic({ changeProfile }) {
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const hiddenFileInput = useRef(null); // to store reference of hidden input tag
  const handleClick = () => {
    hiddenFileInput.current.click(); // click on hidden input tag using its reference
  };

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
      console.log("err in posting data to cloudinary", err);
    }
  }

  useEffect(() => {
    if (image) {
      postData();
      setImage("");
    }
  }, [image]);

  //to upload profile-pic to mongodb
  const postPic = () => {
    axios
      .put(
        "/uploadProfilePic",
        {
          pic: url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((result) => {
        console.log(
          "Success in uploading profile pic to mongodb:",
          result
        );
        changeProfile();
      window.location.reload();
      })
      .catch((err) =>
        console.log("Error in uploading profile pic to mongodb:", err)
      );
  };

  useEffect(()=>{
    if(url){
      postPic();
      setUrl("");
      
    }
  },[url]);

  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={() => {
              handleClick();
            }}
          >
            Upload Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={hiddenFileInput}
            onChange={(event) => {
              setImage(event.target.files[0]);
            }}
            style={{ display: "none" }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" style={{ color: "#ED4956" }} onClick={()=>{
            setUrl(null);
            postPic();
          }}>
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            onClick={() => {
              changeProfile();
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
