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


function Welcome() {
    return(
        <>
            <body class="welcomeBody">
            <h1 class="WelcomeTitle">Welcome to the MLLE!</h1>
            <div>
                <p>
                    <span>
                        <Link to="/sandbox">
                            <button class="useSandboxButton" >Use Sandbox</button>
                        </Link>
                    </span>
                </p>
            </div>
            <p className="footertext">Work in progress. Content is content to change.</p>
            </body>
        </>
    )

}

export default Welcome