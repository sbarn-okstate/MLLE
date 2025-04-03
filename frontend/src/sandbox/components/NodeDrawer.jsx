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
    //ActivationLayerObject,
    // ConvolutionLayerObject,
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
                    {/*=====Dataset draggable=====*/}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dataset") }}><DatasetObject classNameOverride={"drawerNode"} /></div>
                    
                    {/*=====Dense layer draggables=====*/}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("dense") }}><DenseLayerObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("neuron")}}><NeuronObject classNameOverride={"drawerNode"} /></div>

                    {/*=====Activation layer draggables=====*/}
                    {/*The following does not work well.
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation")}}><ActivationLayerObject activationName={"ReLU"} classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation")}}><ActivationLayerObject activationName={"Sigmoid"} classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("activation")}}><ActivationLayerObject activationName={"Tanh"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("activation") }}><ActivationLayerObject activationName={"Softmax"} classNameOverride={"drawerNode"} /></div>
                    */}
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("relu")}}><ReluObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("sigmoid")}}><SigmoidObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("tanh")}}><TanhObject classNameOverride={"drawerNode"} /></div>
                    <div style={{zIndex: 89001}} onClick={() => {createNodeFunction("softmax")}}><SoftmaxObject activationName={"Softmax"} classNameOverride={"drawerNode"} /></div>


                    {/*=====Convolution layer draggables=====*/}
                    {/*The following does not work well.
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution") }}><ConvolutionLayerObject filterSize={"3x3"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution") }}><ConvolutionLayerObject filterSize={"5x5"} classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("convolution") }}><ConvolutionLayerObject filterSize={"7x7"} classNameOverride={"drawerNode"} /></div>
                    */}
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("3x3") }}><ConvolutionLayer3x3Object classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("5x5") }}><ConvolutionLayer5x5Object classNameOverride={"drawerNode"} /></div>
                    <div style={{ zIndex: 89001 }} onClick={() => { createNodeFunction("7x7") }}><ConvolutionLayer7x7Object classNameOverride={"drawerNode"} /></div>

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