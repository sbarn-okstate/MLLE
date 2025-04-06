/* TestDiv.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua
  *
  * PURPOSE: Drawer for selecting nodes to place on stage. 
  * 
  * NOTES: Idealy, this is drag and drop thing.
  * 
  * - Is called by SandboxTest.jsx
  *     - Contains the following functions:
  *         - NodeDrawer: The main function that creates the drawer.
  *             - NodeHandleClick: Function that handles the opening and closing of the drawer.
  */

import { useState } from "react";
import {
    DatasetObject,
    DenseLayerObject,
    DatasetNBC500Object,
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
    ConvolutionLayer7x7Object
 } from './LayerObjects.jsx';

//createNodeFunction is a parameter that has the "AddObject" function
//from SandboxTest.jsx passed to it.
//The return statements in particular is where 
//we see objectType and subType being passed to the function.
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
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset", ".csv", "synthetic_normal_binary_classification_500.csv") }}><DatasetNBC500Object classNameOverride={"drawerNode"} /></div>

                    {/*=====Dense layer draggables=====*/}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dense") }}><DenseLayerObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("neuron")}}><NeuronObject classNameOverride={"drawerNode"} /></div>

                    {/*=====Activation layer draggables=====*/}
                    {/*The following does not work well. 
                    // Keeping here if a fix can be founded later.
                    // Problem is that "activationName" is not being displayed when the object is put onto the stage.
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "relu")}}><ActivationLayerObject activationName={"relu"} classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "sigmoid")}}><ActivationLayerObject activationName={"sigmoid"} classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "tanh")}}><ActivationLayerObject activationName={"tanh"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("activation", "softmax") }}><ActivationLayerObject activationName={"softmax"} classNameOverride={"drawerNode"} /></div>
                    */}
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "relu")}}><ReluObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "sigmoid")}}><SigmoidObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "tanh")}}><TanhObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation", "softmax")}}><SoftmaxObject activationName={"Softmax"} classNameOverride={"drawerNode"} /></div>


                    {/*=====Convolution layer draggables=====*/}
                    {/*The following does not work well. 
                    // Keeping here if a fix can be founded later.
                    // Problem is that "filterSize" is not being displayed when the object is put onto the stage.
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "3x3") }}><ConvolutionLayerObject filterSize={"3x3"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "5x5") }}><ConvolutionLayerObject filterSize={"5x5"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "7x7") }}><ConvolutionLayerObject filterSize={"7x7"} classNameOverride={"drawerNode"} /></div>
                    */}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "3x3") }}><ConvolutionLayer3x3Object classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "5x5") }}><ConvolutionLayer5x5Object classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution", "7x7") }}><ConvolutionLayer7x7Object classNameOverride={"drawerNode"} /></div>


                    {/*=====Output draggable=====*/}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("output") }}><OutputLayerObject classNameOverride={"drawerNode"} /></div>
                </div>
                <div className="nodeDrawerHandle" tabIndex="0" onClick={() => NodeHandleClick()} onKeyDown={(event) => { if (event.key == "Enter" || event.key == " ") NodeHandleClick()}}>
                    <p style={{color: "white", textAlign: "center", userSelect: "none"}}>{handleText}</p>
                </div>
            </div>
        </>
    );
}