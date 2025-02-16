import { Link } from "react-router";
import './Welcome.css'

function useLearn() {
    console.log("useLearn: Not yet implemented!");
}

function useSandbox() {
    console.log("useSandbox: Not yet inplemented!");
}

function useTest() {
    console.log("useTest: Not yet implemented!");
}

function Welcome() {
    return(
        <>
            <h1>Welcome</h1>
            <div>
                <p><span><button onClick={() => useLearn()}>Learn</button></span> &nbsp; &nbsp; &nbsp; <span><button onClick={() => useSandbox()}>Use Sandbox</button></span></p>
            </div>
            <button onClick={() => useTest()}>Test Env</button>
            <p className="footertext">Work in progress. Content is content to change.</p>
            <Link to="/sandbox">CRAP</Link>
        </>
    )

}

export default Welcome