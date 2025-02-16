import { Link } from "react-router";
import './SandboxTest.css';

function test(name) {
    console.log("SandboxTest.test: %s clicked!", name);
}

function SandboxTest() {
    return(
        <>
            <div>
                <Link to="/">Go Back</Link>
            </div>
            <svg>
                <a>
                    <path id="lineAB" d="M 100 350 l 150 -300" stroke="red" strokeWidth="4"/>
                    <path id="lineBC" d="M 250 50 l 150 300" stroke="red" strokeWidth="4"/>
                    <path id="lineMID" d="M 175 200 l 150 0" stroke="green" strokeWidth="4"/>
                    <path id="lineAC" d="M 100 350 q 150 -300 300 0" stroke="blue" strokeWidth="4" fill="none"/>
                </a>
                <a>
                    <rect id="rect1" onClick={() => test("rect")} width="100" height="100" x="10" y="10" rx="10" ry="10" fill="white" />
                    <circle id="nodeConnector1" className="nodeConnector" onClick={() => test("circle")} r="4" cx="160" cy="160" />
                </a>
            </svg>
        </>
    );
}

export default SandboxTest