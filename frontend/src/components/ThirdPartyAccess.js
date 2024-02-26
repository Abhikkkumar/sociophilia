
import React from "react";
// import "../css/following.css";
import "../css/thirdPartyAccess.css";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function ThirdPartyAccess({ setShowAppsList }) {
  const notifySuccess = (message) => toast.success(message);

    function hideApp(event) {
        const button = event.target;
        const listItem = button.parentElement; // Get the parent element of the button
        listItem.style.display = "none"; // Hide the list item
        listItem.style.position = "absolute"; // Remove it from the flow
        notifySuccess("Access Revoked Successfully!");
      }
      
  

  return (
    <div className="darkBg" >
      <div className="following-centered">
        <div className="following">
          <h4>Third Party App Access</h4>
          <button className="closeBtn" onClick={() => setShowAppsList(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          <div className="list-body">
            <div className="list-item t-p-a-list" id="pitfall" >
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="followers-profile-pic"
              />
              <p>pitfall</p>
              <button
                className="revokeBtn"
                value="pitfall"
                onClick={hideApp}
              >
                Revoke
              </button>
            </div>
            <div className="list-item t-p-a-list" id='facebook'>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/2048px-Facebook_icon.svg.png"
                alt="followers-profile-pic"
                
              />
              <p>Facebook</p>
              <button
                className="revokeBtn"
                value="facebook"
                onClick={hideApp}
              >
                Revoke
              </button>
            </div>
            <div className="list-item t-p-a-list" id='instagram'>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wHnShI890dvFjZ8-Wqno5FQpWIWnZaCf495c9cTpgg&s"
                alt="followers-profile-pic"
              />
              <p>Instagram</p>
              <button
                className="revokeBtn"
                value="instagram"
                onClick={hideApp}
              >
                Revoke
              </button>
            </div>
            <div className="list-item t-p-a-list" id="twitter">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAACHCAMAAAALObo4AAAAZlBMVEX///9VrO+dzO1Vre5Lqe1LqO7///1Sq/D7/v3S5fO02PPE3/Bvs+httepHpetSqemRxOVDqPM9oeri8vrs9fqPw+jw/P3o9/tfse5qtvCAvuyo0+/S6fV0uOeFwOq11+wqm+heq+CRkVgXAAADtElEQVR4nO2aa5eiMAyGgdILF4sWERSQnf//J7cFd2YcWhVMPc7ZvB6/eAkPaZsmoUGAQqFQKBQKhUKhUL9dTL9EkkYwShMxWlyOIRjL8lBSSuNnpW3IeJMFjK0ACYJKhqPIk9IW9IvL7Sp/sO3OMIRw2m3XuCOTgAiT4mw5hsjBMQjPxWKOBBxDj3GcLOZIKTxIKNPFKybywUGjxUsmiv1wLAXx5Y/FHDFk6PjiWD4uyIEcyIEc/xvHA79/DQe/i/ICDq6UlIryrw88cnCb8fECRZQcAlFnVUHHHxG5abxx8OPJng3QU8mm4oTt24aSOM6zTs6HCYqjEr0NhJ4FG4skZuqNfaROCWO9xXdAHHQI2ByE8I9gTG/YvyTHZOUmj/LlD9XpkreiP74goSULT+LwOJ8gUBxmFohIXd8p7+e22ZCV3dGbP8pxMqbF96EnMrPaLuP5BAHjuFxiQ0Py+TXZW/zBusLfPJXdZSaKSH5ehW8sxSLLijkF3HqJplaKfu+38oLCK5ttZY3GUPHj89Y1TxnlIdXB02r7YG8WQMV12X2vT0WSVn1TtBbbtSI2h4DtL83hm51LKA/YfIJ0XsclbOL+xzXHaD63nTn2IRiOok6y8soQc3C0O58cJn480MDQwf9sTxCg1m1qv/sZiNh45eC9eKQXq7d+R/MEcN0+9GdXrxFs3dpiuEVnRxMHLE+m7QN/ZYfGkcdCcZBQ6U3+nk+YI3qA1g1Fe39obKkpNAf982HPe75UK/8c/HzHHfo6FX2BP0wudJODlbGzvgTk0Ev3likd5xy1FjCHLpqm67lAbjXmQetsGk3Vm8Wi/ry2JqYeOEgoz7XdnEZz7XAe/KHNqaqrbRyBrn+tCSEwx/TMT0sWg4WC3ZqjsP4wjx85VadyjqFLTtf+Bs3BOd+p4jwc5smxnhtlY88GoTnIJj9FQ7cfl8vMoBh0JXlrckBx8OMw3fe1qfEDFnT9PWeA+UPPznY+L8ZlkvTOvc0DBwkp6YfyOrAzUbZH02N4bf+US5lXbVbWep6KQ5ml1VE691ePHEYxlUoaKUmps5fpnyOcItoYTBZ1e730k1c8B/ivnjcgB3IgB3K8Gwc8Bll1LgfeH4Zj6YGpd+FI4Tl0JZguHpfExzxdcZ5O5PAHtx5tN17Jw3lLueK85Xj+FG5ojCW16vwpC7awIURaH6DdxzDnk2NzPhlE8Saz927ucgQB8HntxWv2J847aGqFPa2nMSAc8jZORaFQKBQKhUKhfpf+AoIPPPLNB3hsAAAAAElFTkSuQmCC"
                alt="followers-profile-pic"
              />
              <p>Twitter</p>
              <button
                className="revokeBtn"
                value="twitter"
                onClick={hideApp}
              >
                Revoke
              </button>
            </div>
            <div className="list-item t-p-a-list" id='snapchat'>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGNh5mEIxI-gT8xlKEqXKt75AejFCMlPj2Ig&usqp=CAU"
                alt="followers-profile-pic"
              />
              <p>Snapchat</p>
              <button
                className="revokeBtn"
                value="snapchat"
                onClick={hideApp}
              >
                Revoke
              </button>
              
            </div>
            <div className="list-item t-p-a-list" id='github'>
              <img
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="followers-profile-pic"
              />
              <p>Github</p>
              <button
                className="revokeBtn"
                value="github"
                onClick={hideApp}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
