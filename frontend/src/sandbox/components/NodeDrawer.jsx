import { useState } from "react";

export default function NodeDrawer() {
    const [drawerCollapse, setDrawerCollapse] = useState("drawerDivCollapsed");
    const [handleText, setHandleText] = useState("→");
    var collapsed = true;

    function NodeHandleClick() {
        if (collapsed === false) {
            setDrawerCollapse("drawerDivCollapsed");
            setHandleText("→");
        } else {
            setDrawerCollapse("drawerDiv");
            setHandleText("←");
        }

        collapsed = !collapsed;
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
                <div className="nodeDrawerHandle" onClick={() => NodeHandleClick()}>
                    <p style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}