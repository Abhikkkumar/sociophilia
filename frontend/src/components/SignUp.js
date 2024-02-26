import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo_1 from "../img/logo-1.jpg";
import "../css/signup.css";
import axios from "axios";
import { toast } from "react-toastify"; // react-toastify is used to handle notification beautifully
import Footer from "../components/Footer";

const SignUp = () => {
  //------------ api call only using JS
  /*
  const fetchData = async ()=>{
    const response = await fetch("http://localhost:5000/data");
    const data = await response.json();
    console.log(data);
  }
  useEffect(()=>{
    fetchData();
  },[]);
*/
  //----------------
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const navigate = useNavigate();

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  async function postData() {
    if (!emailRegex.test(email)) {
      notifyError("Invalid Email!");
      return;
    }
    try {
      const response = await axios.post("/signup/", {
        name,
        username,
        email,
        password,
      });
      // console.log(response);
      notifySuccess(response.data.message);
      navigate("/signin"); //moving to signin page after successful registration.
    } catch (error) {
      notifyError(error.response.data.error);
    }
  }

  return (
    <div className="s-createPost" >
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          {/* <img className="signUpLogo" src={logo} alt="signup insta logo" /> */}
          <div className="logo-div" style={{padding:"0px", marginBottom:"5px"}}>
            <img
              className="insta-logo insta-logo-1"
              src={logo_1}
              alt="logo"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
          <p className="loginPara">
            Sign up to see photos and videos
            <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="text"
              id="name"
              name="fullName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Full Name"
            />
          </div>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="Username"
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0" }}
          >
            By signing up, you are agreeing to our Terms,
            <br />
            privacy policy and cookies policy
          </p>
          <input
            type="submit"
            id="submit-btn"
            value="Sign Up"
            onClick={() => {
              postData();
            }}
          />
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default SignUp;
