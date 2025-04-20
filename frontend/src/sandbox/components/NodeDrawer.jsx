/* NodeDrawer.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua
  *
  * PURPOSE: Drawer for selecting nodes to place on stage. 
  * 
  * NOTES: Idealy, this is drag and drop thing.
  * 
  * - Is called by Sandbox.jsx
  *     - Contains the following functions:
  *         - NodeDrawer: The main function that creates the drawer.
  *             - NodeHandleClick: Function that handles the opening and closing of the drawer.
  */

import { useState } from "react";
import {
    DatasetObject,
    DenseLayerObject,
    DatasetNBC500Object,
    DatasetHeartPredictionObject,
    DatasetBostonHousingObject,
    DatasetMNISTObject,
    DatasetFashionMNISTObject,


    //ActivationLayerObject,
    //ConvolutionLayerObject,
    NeuronObject,
    OutputLayerObject,
    
    ReluObject,
    SigmoidObject,
    TanhObject,
    SoftmaxObject,
    
    ConvolutionLayer3x3Object,
    ConvolutionLayer5x5Object,
    ConvolutionLayer7x7Object,
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
                <div className="nodeDrawer">
                    {/* Instruction Bar */}
                    <div className="nodeDrawerInstructionBar">
                        Click to spawn a dataset
                    </div>


                    {/*=====Dataset draggables=====*/}
                    {/*
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset") }}><DatasetObject classNameOverride={"drawerNode"} /></div>
                    */}
                    {/*
                        createNodeFunction takes in three possible parameters. They are:
                            - objectType, subType, and datasetFileName.
                                - objectType: The type of object to create. (dataset, dense, activation, convolution, output)
                                - subType: The subtype of the object to create. (e.g. relu, sigmoid, tanh, softmax, 3x3, 5x5, 7x7)  
                                - datasetFileName: The name of the file to use. (e.g. synthetic_normal_binary_classification_500.csv)
                    */}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "synthetic_normal_binary_classification_500.csv") }}><DatasetNBC500Object/></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "heart.csv") }}><DatasetHeartPredictionObject classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "boston-housing-train.csv") }}><DatasetBostonHousingObject classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "mnist_train.csv") }}><DatasetMNISTObject classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "fashion-mnist_train.csv") }}><DatasetFashionMNISTObject classNameOverride={"drawerNode"} /></div>
                </div>
                <div className="nodeDrawerHandle" tabIndex="0" onClick={NodeHandleClick} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") NodeHandleClick(); }}>
                    <p className="nodeDrawerHandleText" style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}