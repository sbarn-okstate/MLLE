/* LayerObjects.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua, Samuel Barney
  *
  * PURPOSE: Node components for sandbox enviroment.
  * 
  * NOTES: Once actual nodes are created, this should be removed.
  *        These are called from NodeDrawer.jsx. 
  * 
  * *       LayerObjects.jsx contains the following functions:
  * *               - renderLinkedIndicators(): Helper function to render all link indicators
  
  * *               - DatasetObject(): Dataset object that corresponds with synthetic_normal_binary_classification_500.csv
  * *               - DatasetNBC500Object(): Dataset object that corresponds with synthetic_normal_binary_classification_500.csv
  
  * *               - DenseLayerObject(): Dense layer object
  * *               - NeuronObject(): Neuron object
  
  * *               - ActivationLayerObject(): Activation layer object
  * * *                 - ReluObject(): Relu object
  * * *                 - SigmoidObject(): Sigmoid object
  * * *                 - TanhObject(): Tanh object
  * * *                 - SoftmaxObject(): Softmax object
  
  * * *               - ConvolutionLayerObject(): Convolution layer object
  * * *                 - ConvolutionLayer3x3Object(): Convolution layer object with 3x3 filter size
  * * *                 - ConvolutionLayer5x5Object(): Convolution layer object with 5x5 filter size
  * * *                 - ConvolutionLayer7x7Object(): Convolution layer object with 7x7 filter size
  
  * * *               - OutputLayerObject(): Output layer object  
  */

import React, { forwardRef } from "react";
import "./LayerObjects.css";

import openLinkLR from "../../assets/openLinkLR.svg";
import openLinkTB from "../../assets/openLinkTB.svg";
import closedLinkLR from "../../assets/closedLinkLR.svg";
import closedLinkTB from "../../assets/closedLinkTB.svg";

const openLinkLeft = openLinkLR;
const openLinkRight = openLinkLR;
const openLinkTop = openLinkTB;
const openLinkBottom = openLinkTB;
const closedLinkLeft = closedLinkLR;
const closedLinkRight = closedLinkLR;
const closedLinkTop = closedLinkTB;
const closedLinkBottom = closedLinkTB;  

// Helper function to render all link indicators
export function renderLinkIndicators(linkStates) {
    const positionToAltText = {
        top: "Top Link",
        right: "Right Link",
        bottom: "Bottom Link",
        left: "Left Link",
    };
    
    const positionToSVG = {
        top: openLinkTop,
        bottom: openLinkBottom,
        left: openLinkLeft,
        right: openLinkRight,
    };

    const closedPositionToSVG = {
        top: closedLinkTop,
        bottom: closedLinkBottom,
        left: closedLinkLeft,
        right: closedLinkRight,
    };

    return Object.entries(linkStates).map(([position, value]) => {
        if (value === 0) {
            return null; // No image for 0
        }

        // Use the correct SVG based on the position and link state
        const src = value ? closedPositionToSVG[position] : positionToSVG[position];
        const alt = positionToAltText[position] || "Link"; // Use predefined alt text or fallback to "Link"

        return (
            <img
                key={position} // Use position as the key
                src={src} // Dynamically assign the correct SVG
                alt={alt}
                className={`link-indicator ${position}-link`}
            />
        );
    });
}

//================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================
// synthetic_normal_binary_classification_500.csv
// Dataset Object
export function DatasetObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p>Dataset: 
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
            </p>

        </div>
    );
};
//dataset object that corresponds with synthetic_normal_binary_classification_500.csv
export function DatasetNBC500Object({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p className={"nodeText"} style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> synthetic dataset<br/><br/>synthetic_normal_binary_classification_500.csv
                
            </p>

        </div>
    );
};

//dataset object that corresponds with synthetic_normal_binary_classification_500.csv
export function DatasetHeartPredictionObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p className={"nodeText"} style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Heart Prediction Dataset<br/><br/>heart.csv
                
            </p>

        </div>
    );
};

export function DatasetBostonHousingObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p className={"nodeText"} style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Boston Housing Dataset<br/><br/>boston-housing-train.csv
                
            </p>

        </div>
    );
};

export function DatasetMNISTObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p className={"nodeText"} style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> MNIST Dataset<br/><br/>mnist_train.csv
                
            </p>

        </div>
    );
};


export function DatasetFashionMNISTObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p className={"nodeText"} style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Fashion MNIST Dataset<br/><br/>fashion-mnist_train.csv
                
            </p>

        </div>
    );
};
//================DATASET OBJECTS ENDS HERE======================DATASET OBJECTS ENDS HERE======================DATASET OBJECTS ENDS HERE======================

//================DENSE OBJECTS START HERE================================DENSE OBJECTS START HERE================================DENSE OBJECTS START HERE================
// Dense Layer Object
export function DenseLayerObject({ name, ref, handleRef, classNameOverride = "draggable", text = "placeholder" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "#4CAF50", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dense Layer</p>
            </div>
            <p className={"nodeText"}>Number of Nodes: 
                <span>
                    <input
                        type="number"
                        name={name + "units"}
                        id={name + "units"}
                        min="1"
                        max="16"
                        defaultValue="2"
                        style={{ width: "60px" }}
                    />
                </span>
            </p>
        </div>
    );
};

// Neuron Object
export function NeuronObject({ name, ref, handleRef, classNameOverride = "draggable", linkStates = {} }) {

    return (
        <div
            ref={ref}
            id={name}
            className={`${classNameOverride} neuron-container`}
        >
            {/* Draggable handle in the center */}
            <div ref={handleRef} className="neuron">
                <p className="nodeDragText">Neuron</p>
            </div>

            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates)}
        </div>
    );
}
//================DENSE OBJECTS ENDS HERE================================DENSE OBJECTS ENDS HERE================================DENSE OBJECTS ENDS HERE================

//================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================

// Activation Layer Object
export function ActivationLayerObject({ activationName, name, ref, handleRef, classNameOverride = "draggable",}) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(0,153,255)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer {activationName}</p>
            </div>
            <p className={"nodeText"}>
                activation type: {activationName}
            </p>
        </div>
    );
};

export function ReluObject({ name, ref, handleRef, classNameOverride = "draggable",  linkStates = {}  }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                ReLu
            </p>
            

            {renderLinkIndicators(linkStates)}
        </div>
    );
}

export function SigmoidObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Sigmoid
            </p>
        </div>
    );
}

export function TanhObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Tanh
            </p>
        </div>
    );
}

export function SoftmaxObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Softmax
            </p>
        </div>
    );
}
//================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================

//================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================
// // Convolution Layer Object
export function ConvolutionLayerObject({filterSize, name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>{filterSize} Filter size
            </p>
        </div>
    );
};

//Convolution Layer Object
export function ConvolutionLayer3x3Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 3x3
            </p>
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer5x5Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 5x5
            </p>
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer7x7Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 7x7
            </p>
        </div>
    );
};
//================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================

// Output Layer Object
export function OutputLayerObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(255, 140, 0)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Output</p>
            </div>
            <p className={"nodeText"}>Output Layer</p>
        </div>
    );
};
