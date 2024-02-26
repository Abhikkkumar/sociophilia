import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "../css/modal.css";

export default function Modal({ setModalOpen, setUserLogin }) {
    const navigate = useNavigate();
  return (
    <div
      className="darkBg"
      onClick={() => {
        setModalOpen(false);
      }}
    >
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          {/* modelContent */}
          <div className="modalContent">Do you really want to log Out?</div>
          <div className="modalActions">
            <div className="actionContainer">
              <button className="logOutBtn" onClick={()=>{
                  setModalOpen(false);
                  localStorage.clear();
                  setUserLogin(false);
                  navigate("/signin");
              }}>Log Out</button>
              <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
