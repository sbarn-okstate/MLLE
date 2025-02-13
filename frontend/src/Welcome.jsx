import './Welcome.css'

function useLearn() {
    console.log("useLearn: Not yet implemented!");
}

function useSandbox() {
    console.log("useSandbox: Not yet inplemented!");
}

function Welcome() {
    return(
        <>
            <h1>Welcome</h1>
            <p className="welcometext">Would you like to:</p>
            <div>
                <p><span><button onClick={() => useLearn()}>Learn</button></span> OR <span><button onClick={() => useSandbox()}>Use Sandbox</button></span></p>
            </div>
            <p className="footertext">Work in progress. Content is content to change.</p>
        </>
    )

}

export default Welcome