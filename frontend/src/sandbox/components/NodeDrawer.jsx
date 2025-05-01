/* NodeDrawer.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua
  *
  * PURPOSE: Drawer for selecting nodes to place on stage. 
  * 
  * NOTES: 
  * 
  * - Is called by Sandbox.jsx
  *     - Contains the following functions:
  *         - NodeDrawer: The main function that creates the drawer.
  *             - NodeHandleClick: Function that handles the opening and closing of the drawer.
  */

import { useState } from "react";
import {
    DatasetObject,
 } from './LayerObjects.jsx';
 import './NodeDrawer.css';

//createNodeFunction is a parameter that has the "AddObject" function
//from Sandbox.jsx passed to it.
//The return statements in particular is where 
//we see objectType and subType being passed to the function.
export default function NodeDrawer({drawerOpen, setDrawerOpen, createNodeFunction}) {
    const [drawerCollapse, setDrawerCollapse] = useState("drawerDivCollapsed");
    const [handleText, setHandleText] = useState("Datasets ▼");

    function NodeHandleClick() {
        if (drawerOpen === false) {
            setDrawerCollapse("drawerDiv");
            setHandleText("Datasets ▲");
        } else {
            setDrawerCollapse("drawerDivCollapsed");
            setHandleText("Datasets ▼");
        }

        setDrawerOpen(!drawerOpen);
    }

    return(
        <>
            <div className={drawerCollapse}>
                <div className="nodeDrawerInstructionBar">
                    Click to spawn a dataset
                </div>
                <div className="nodeDrawer">
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "moons_dataset.csv") }}><DatasetObject classNameOverride="dataset-container-node-drawer" fileName={"moons_dataset.csv"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "iris_dataset.csv") }}><DatasetObject classNameOverride="dataset-container-node-drawer" fileName={"iris_dataset.csv"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "weather_dataset.csv") }}><DatasetObject classNameOverride="dataset-container-node-drawer" fileName={"weather_dataset.csv"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "health_dataset.csv") }}><DatasetObject classNameOverride="dataset-container-node-drawer" fileName={"health_dataset.csv"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "spiral_dataset.csv") }}><DatasetObject classNameOverride="dataset-container-node-drawer" fileName={"spiral_dataset.csv"} /></div>
                </div>
                <div className="nodeDrawerHandle" tabIndex="0" onClick={NodeHandleClick} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") NodeHandleClick(); }}>
                    <p className="nodeDrawerHandleText" style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}