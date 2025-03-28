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
            <h1>Welcome</h1>
            <div>
                <p>
                    <span>
                        <Link to="/sandbox">
                            <button>Use Sandbox</button>
                        </Link>
                    </span>
                </p>
            </div>
            <p className="footertext">Work in progress. Content is content to change.</p>
        </>
    )

}

export default Welcome