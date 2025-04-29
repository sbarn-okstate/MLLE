/* Welcome.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Landing page for the webapp.
  * 
  * NOTES: Maybe at some point we just go directly to the sandbox? Would we
  *        need this page?
  */

import { Link } from "react-router";
import './Welcome.css'
import WelcomeButtons from './WelcomeButtons.jsx'

function Welcome() {
    return(
        <>
            <div className="welcomeBody">
                <h1 className="WelcomeTitle">Welcome to the<br></br>Machine Learning Learning<br></br>Environment!</h1>

                <div className="contentContainer">
                    <div>
                        <WelcomeButtons></WelcomeButtons>
                    </div>
                    <div>
                        <p className="footertext">Created in Spring of 2025 at Oklahoma State University<br></br> by Samuel Barney, Justin Moua, and Mark Taylor.</p>
                    </div>
                </div>
            </div>
            {/* <div>
                <p>
                    <span>
                    <button className="useSandboxButton" >Test1</button>
                        <Link to="/sandbox">
                            <button className="useSandboxButton" >Get Started</button>
                        </Link>
                    </span>
                    <button className="useSandboxButton" >Test</button>
                </p>
            </div> */}
            
        </>
    )

}

export default Welcome