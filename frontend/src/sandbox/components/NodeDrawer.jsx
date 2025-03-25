/* TestDiv.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Drawer for selecting nodes to place on stage.
  * 
  * NOTES: Idealy, this is drag and drop thing.
  */

import { useState } from "react";
import {
    DatasetObject,
    DenseLayerObject,
    ActivationLayerObject,
    ConvolutionLayerObject,
    OutputLayerObject
 } from './LayerObjects.jsx';

export default function NodeDrawer({drawerOpen, setDrawerOpen, createNodeFunction}) {
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
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("dataset")}}><DatasetObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("dense")}}><DenseLayerObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation")}}><ActivationLayerObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("convolution")}}><ConvolutionLayerObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("output")}}><OutputLayerObject classNameOverride={"drawerNode"} /></div>
                </div>
                <div className="nodeDrawerHandle" tabIndex="0" onClick={() => NodeHandleClick()} onKeyDown={(event) => { if (event.key == "Enter" || event.key == " ") NodeHandleClick()}}>
                    <p style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}