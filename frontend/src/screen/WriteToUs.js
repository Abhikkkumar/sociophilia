import React, { useState } from "react";
import "../css/writetous.css";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
// import { useEffect } from "react";

export default function WriteToUs() {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  return (
    <div className="s-createPost">
      <div className="writeToUs">
        <div className="help-form-container">
          <h2>Write To Us</h2>
          <div className="help-form">
            <input
              value={heading}
              type="text"
              placeholder="Write your query heading"
              onChange={(e) => {
                setHeading(e.target.value);
              }}
            />
            <textarea
              value={body}
              placeholder="Write your query details..."
              onChange={(e) => {
                setBody(e.target.value);
              }}
            ></textarea>
            <button
              className="msg-submit"
              onClick={() => {
                if (body && heading) {
                  notifySuccess("Thank You! Your message has been posted.");
                  setBody("");
                  setHeading("");
                } else {
                  notifyError("Please fill all the required fields!");
                }
              }}
            >
              Post
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
