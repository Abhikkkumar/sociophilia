import "./App.css";
import React, { useState } from "react";
import Navabar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screen/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
// import Profile from "./screen/Profile";
import CreatePost from "./screen/CreatePost.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "./contexts/LoginContext";
import Modal from "./components/Modal";
import UserProfile from "./components/UserProfile";
import MyFollowingPost from "./screen/MyFollowingPost";
import Following from "./components/Following";
import Privacy from "./screen/Privacy";
import WriteToUs from "./screen/WriteToUs";
import SearchResult from "./screen/SearchResult";


function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [showConnection, setShowConnection] = useState(false); // 'showFollowing' decides visibility of 'Followers' or 'Following'
  const [userConnectionData, setUserConnectionData] = useState(""); //userProfileData contains data which will be used to show "followers" and "following"

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider
          value={{
            setUserLogin,
            setModalOpen,
            setShowConnection,
            setUserConnectionData,
            
          }}
        >
          <Navabar login={userLogin} searchValue={searchValue} setShowSearch={setShowSearch} setSearchValue={setSearchValue}/>
          
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/signin" element={<SignIn />}></Route>
            {/* <Route exact path="/profile" element={<Profile />}></Route> */}
            <Route path="/createPost" element={<CreatePost />}></Route>
            <Route path="/profile/:userid" element={<UserProfile />}></Route>
            <Route path="/followingPost" element={<MyFollowingPost />}></Route>
            <Route path="/privacy" element={<Privacy />}></Route>
            <Route path="/writetous" element={<WriteToUs />}></Route>
          </Routes>
         
          <ToastContainer theme="dark" />
          {modalOpen && (
            <Modal
              setModalOpen={setModalOpen}
              setUserLogin={setUserLogin}
            ></Modal>
          )}
          {showConnection && (
            <Following
              setShowConnection={setShowConnection}
              // connectionName={connectionName}
              userConnectionData={userConnectionData}
            />
          )}
          {showSearch && (
            <SearchResult searchValue={searchValue} setSearchValue={setSearchValue} setShowSearch={setShowSearch} />
          )}
          
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
