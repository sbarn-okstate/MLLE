import { useState } from "react";

export default function NodeDrawer({drawerOpen, setDrawerOpen}) {
    const [drawerCollapse, setDrawerCollapse] = useState("drawerDivCollapsed");
    const [handleText, setHandleText] = useState("→");

    function NodeHandleClick() {
        if (drawerOpen === false) {
            setDrawerCollapse("drawerDiv");
            setHandleText("←");
        } else {
            setDrawerCollapse("drawerDivCollapsed");
            setHandleText("→");
        }

        setDrawerOpen(!drawerOpen);
    }

    return(
        <>
            <div className={drawerCollapse}>
                <div className="nodeDrawer">
                    <div className="DELETEME"/>
                    <div className="DELETEME"/>
                    <div className="DELETEME"/>
                    <div className="DELETEME"/>
                    <div className="DELETEME"/>
                </div>
                <div className="nodeDrawerHandle" tabIndex="0" onClick={() => NodeHandleClick()} onKeyDown={(event) => { if (event.key == "Enter" || event.key == " ") NodeHandleClick()}}>
                    <p style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}