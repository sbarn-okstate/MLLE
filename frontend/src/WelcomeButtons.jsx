import './WelcomeButtons.css';
import { Link } from "react-router";
import React from "react";
import ReactDOM from "react-dom";

const OverlayRoot = document.getElementById("overlay-root");

const Overlay = ({ children, onClose }) => { //Refer to https://stackoverflow.com/questions/61749580/how-to-create-an-overlay-with-react
  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="overlayContent" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="closeButton" onClick={onClose}>Close</button>
      </div>
    </div>,
    OverlayRoot
  );
};

const WelcomeButtons = () => {
  const [openAuthors, setOpenAuthors] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);

  return (
    <>
      <span>
        <button className="useSandboxButton" onClick={() => setOpenProject(true)}>About This Project</button>
        <Link to="/sandbox">
            <button className="useSandboxButton">Get Started</button>
        </Link>
      </span>
      <button className="useSandboxButton" onClick={()=>setOpenAuthors(true)}>About The Authors</button>

      {/* Modal for "About This Project" */}
      {openProject && (
        <Overlay onClose={() => setOpenProject(false)}>
        <h2>About This Project</h2>
        <p>This project is designed to provide an interactive environment for learning neural networks in machine learning.</p>
        </Overlay>
      )}

      {/* Modal for "About The Authors" */}
      {openAuthors && (
        <Overlay onClose={() => setOpenAuthors(false)}>
          <h2>About The Authors</h2>
          <p>This application was created by Mark Taylor, Justin Moua, and Samuel Barney in Spring 2025 at Oklahoma State University.</p>
        <div className="horizontalContainer">
            <div className="authorCard">
            <img src={'./src/assets/JM.jpg'} alt="Samuel Barney" />
            <p>Samuel Barney</p>
            <p>HYPERLINK HERE</p>
            </div>
            

            <div className="authorCard">
            <img src={'./src/assets/JM.jpg'} alt="Justin Moua" />
            <p>Justin<br></br>Moua</p>
            <p>HYPERLINK HERE</p>
            </div>
            

            <div className="authorCard">
            <img src={'./src/assets/JM.jpg'} alt="Mark Taylor" />
            <p>Mark<br></br>Taylor</p>
            <p>HYPERLINK HERE</p>
            </div>
            
        </div>
        </Overlay>
      )}
    </>
  );
};

export default WelcomeButtons;