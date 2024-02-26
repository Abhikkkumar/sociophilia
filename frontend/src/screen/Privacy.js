import React, { useState, useEffect } from "react";
import FollowingPrivacy from "../components/FollowingPrivacy";
import FollowerPrivacy from "../components/FollowerPrivacy";
import PhotoPrivacy from "../components/PhotoPrivacy";
import Download from "../components/Download";
import ThirdPartyAccess from "../components/ThirdPartyAccess";
import "../css/privacy.css";
import Footer from "../components/Footer";

export default function Privacy() {
  const [showPhotoPrivacy, setShowPhotoPrivacy] = useState(false);
  const [showFollowerPrivacy, setShowFollowerPrivacy] = useState(false);
  const [showFollowingPrivacy, setShowFollowingPrivacy] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showAppsList, setShowAppsList] = useState(false);

  return (
    <div className="s-createPost">
      <div className="privacy">
        <h2>Privacy Settings</h2>
        <div className="card-list">
          <div className="option-card">
            <div className="detail">
              Customize your profile photo visibility by locking or unlocking
              users from seeing your photo
            </div>
            <div className="card-header">
              <h4>Profile Photo Privacy</h4>
            </div>
            <div className="card-btn">
              <button
                onClick={() => {
                  setShowPhotoPrivacy(true);
                }}
              >
                Click Me
              </button>
            </div>
          </div>
          <div className="option-card">
            <div className="detail">
              Customize the access of other users to your followers list by
              locking or unlocking them
            </div>
            <div className="card-header">
              <h4>My Followers List Privacy</h4>
            </div>
            <div className="card-btn">
              <button
                onClick={() => {
                  setShowFollowerPrivacy(true);
                }}
              >
                Click Me
              </button>
            </div>
          </div>
          <div className="option-card">
            <div className="detail">
              Choose the users who can see the people you follow
            </div>
            <div className="card-header">
              <h4>My Following List Privacy</h4>
            </div>
            <div className="card-btn">
              <button
                onClick={() => {
                  setShowFollowingPrivacy(true);
                }}
              >
                Click Me
              </button>
            </div>
          </div>
          <div className="option-card">
            <div className="detail">
              Click below to download all your data saved on BIEV
            </div>
            <div className="card-header">
              <h4>Download Data</h4>
            </div>
            <div className="card-btn">
              <button
                onClick={() => {
                  setShowDownload(true);
                }}
              >
                Click Me
              </button>
            </div>
          </div>
          <div className="option-card">
            <div className="detail">Revoke third party access </div>
            <div className="card-header">
              <h4>Third Party App Access</h4>
            </div>
            <div className="card-btn">
              <button
                onClick={() => {
                  setShowAppsList(true);
                }}
              >
                Click Me
              </button>
            </div>
          </div>
        </div>

        {showPhotoPrivacy && (
          <PhotoPrivacy setShowPhotoPrivacy={setShowPhotoPrivacy} />
        )}
        {showFollowerPrivacy && (
          <FollowerPrivacy setShowFollowerPrivacy={setShowFollowerPrivacy} />
        )}
        {showFollowingPrivacy && (
          <FollowingPrivacy setShowFollowingPrivacy={setShowFollowingPrivacy} />
        )}
        {showDownload && <Download setShowDownload={setShowDownload} />}
        {showAppsList && <ThirdPartyAccess setShowAppsList={setShowAppsList} />}
      </div>
      <Footer />
    </div>
  );
}
