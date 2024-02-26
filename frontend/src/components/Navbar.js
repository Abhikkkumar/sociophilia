import React, { useContext } from "react";
import Logo from "../img/bird-logo.jpeg";
import logo_1 from "../img/logo-1.jpg";
import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

const Navbar = ({ login,searchValue, setShowSearch, setSearchValue }) => {
  const navigate = useNavigate();

 
  const { setModalOpen } = useContext(LoginContext);
  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      return [
        <>
          <div className="home-search">
            <input
              type="text"
              value={searchValue}
              placeholder="Search user by the name"
              onChange={(e)=>{setSearchValue(e.target.value)}}
              onKeyPress={(e) => {
                if (e.key === 'Enter') setShowSearch(true);;
              }}
            />
          </div>
          <Link to={`profile/${loggedUser._id}`}>
            <li className="nav-item">Profile</li>
          </Link>
          <Link to="createPost">
            <li>Create Post </li>
          </Link>
          <Link to="followingPost">
            <li>My Following</li>
          </Link>
          <Link to="privacy">
            <li>Privacy</li>
          </Link>
          <Link to="writetous">
            <li>Help</li>
          </Link>
          <Link to={""}>
            <button
              className="primaryBtn"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Log Out
            </button>
          </Link>
        </>,
      ];
    } else {
      return [
        <>
          <Link to="signup">
            <li className="nav-item">SignUp</li>
          </Link>
          <Link to="signin">
            <li className="nav-item">Signin</li>
          </Link>
        </>,
      ];
    }
  };
  return (
    <div>
      <div className="navbar">
        <div
          className="n-one"
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            className="insta-logo"
            src={Logo}
            alt="logo"
            style={{ cursor: "pointer" }}
          />
          <img
            className="insta-logo insta-logo-1"
            src={logo_1}
            alt="logo"
            style={{ cursor: "pointer" }}
          />
        </div>

        <ul className="nav-list">{loginStatus()}</ul>
      </div>
    </div>
  );
};

export default Navbar;
