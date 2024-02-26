import React from "react";
import "../css/download.css";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';

export default function Download({setShowDownload}) {
  function generatePDF() {
    axios
      .get("/generate-data", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "user-data.pdf");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error generating PDF", error);
      });
  }

  return (
    

    <div className="darkBg">
      <div className="lmt-shr-centered">
        <div className="limited-sharing">
          <h4>Click below to download your data</h4>
          <button
            style={{ backgroundColor: "red" }}
            className="closeBtn"
            onClick={() => {
              setShowDownload(false);
            }}
          >
            <RiCloseLine></RiCloseLine>
          </button>
          <div className="download-body">
            <button
              className="downloadBtn"
              onClick={() => {
                generatePDF();
              }}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
