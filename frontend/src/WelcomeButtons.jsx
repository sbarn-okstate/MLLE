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
        <div style={{
          width: "100%",
          paddingRight: "20px",
          display: "inline-flex",
          justifyContent: "flex-start",
          gap: "10px"
      }}>
          <button className="useSandboxButton" onClick={() => setOpenProject(true)}>About This Project</button>
          <Link to="/sandbox">
              <button className="useSandboxButton">Get Started</button>
          </Link>
        <button className="useSandboxButton" onClick={()=>setOpenAuthors(true)}>About The Authors</button>
      </div>
      {/* Modal for "About This Project" */}
      {openProject && (
        <Overlay onClose={() => setOpenProject(false)}>
        <p>About This Project</p>
        <p>This project is designed to provide an interactive environment for learning neural networks in machine learning.</p>
        </Overlay>
      )}

      {/* Modal for "About The Authors" */}
      {openAuthors && (
        <Overlay onClose={() => setOpenAuthors(false)}>
          <p>About the Authors</p>
          <p>This application was created by Mark Taylor, Justin Moua, and Samuel Barney in Spring 2025 at Oklahoma State University.</p>
        <div className="horizontalContainer">
            <div className="authorCard">
            <img src={'./src/assets/dev_purposes/missing_textures2.jpg'} alt="Samuel Barney" />
            <p>Samuel Barney</p>
            <a href='https://www.linkedin.com/' target="_blank"><img className="linkedin" src="./src/assets/linkedin.png"></img></a>
            <a href='https://github.com/sbarn-okstate' target="_blank"><img className="github" src="./src/assets/github.png"></img></a>
            </div>
            

            <div className="authorCard">
            <img src={'./src/assets/JM.jpg'} alt="Justin Moua" />
            <p>Justin Moua</p>
            <a href='https://www.linkedin.com/in/justin-moua/' target="_blank"><img className="linkedin" src="./src/assets/linkedin.png"></img></a>
            <a href='https://github.com/JustinMoua' target="_blank"><img className="github" src="./src/assets/github.png"></img></a>
            </div>
            

            <div className="authorCard">
            <img src={'./src/assets/dev_purposes/missing_textures2.jpg'} alt="Mark Taylor" />
            <p>Mark Taylor</p>
            <a href='https://www.linkedin.com/' target="_blank"><img className="linkedin" src="./src/assets/linkedin.png"></img></a>
            <a href='https://github.com/MarkkusBoi' target="_blank"><img className="github" src="./src/assets/github.png"></img></a>
            </div>
            
        </div>
        </Overlay>
      )}
    </>
  );
};

export default WelcomeButtons;