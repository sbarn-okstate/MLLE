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
import "./LayerObjects/Datasets.css";
import "./LayerObjects/Neuron.css";
import "./LayerObjects/Activation.css";
import "./LayerObjects/DataBatcher.css";

import openLinkLR from "../../assets/openLinkLR.svg";
import openLinkTB from "../../assets/openLinkTB.svg";
import closedLinkLR from "../../assets/closedLinkLR.svg";
import closedLinkTB from "../../assets/closedLinkTB.svg";
import synthetic1graph from "../../assets/synthetic1graph.png";
import dataBatcherGraphic from "../../assets/data-batcher.svg";

const openLinkLeft = openLinkLR;
const openLinkRight = openLinkLR;
const openLinkTop = openLinkTB;
const openLinkBottom = openLinkTB;
const closedLinkLeft = closedLinkLR;
const closedLinkRight = closedLinkLR;
const closedLinkTop = closedLinkTB;
const closedLinkBottom = closedLinkTB;  

// Helper function to render all link indicators
export function renderLinkIndicators(linkStates, height = 100, width = 200) {
    const x_center = width / 2;
    const y_center = height / 2;

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

    // Map positions to coordinates (center of indicator at edge)
    const indicatorSize = 32; // px, adjust as needed
    const positionToCoords = {
        top:    { x: x_center, y: 10 },
        right:  { x: width - 10,    y: y_center },
        bottom: { x: x_center, y: height - 10 },
        left:   { x: 10,        y: y_center },
    };

    return (
        <>
            {/* SVG lines */}
            <svg
                className="link-indicator-svg"
                width={width}
                height={height}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                    zIndex: -1,
                }}
            >
                {Object.entries(linkStates).map(([position, value]) => {
                    if (value === 0) return null;
                    const { x, y } = positionToCoords[position];
                    return (
                        <line
                            key={position}
                            x1={x_center}
                            y1={y_center}
                            x2={x}
                            y2={y}
                            stroke={value ? "white" : "grey"}
                            strokeWidth="1"
                            strokeDasharray={value ? "0" : "4 4"}
                        />
                    );
                })}
            </svg>
            {/* Link indicator icons */}
            {Object.entries(linkStates).map(([position, value]) => {
                if (value === 0) return null;
                const src = value ? closedPositionToSVG[position] : positionToSVG[position];
                const alt = positionToAltText[position] || "Link";
                const { x, y } = positionToCoords[position];
                return (
                    <img
                        key={position}
                        src={src}
                        alt={alt}
                        className={`link-indicator ${position}-link`}
                    />
                );
            })}
        </>
    );
}

export function DataBatcher({ ref, handleRef, name, classNameOverride = "", displayText = "", linkStates = {} }) {
    return (
        <div ref={ref} id={name} className={`dataBatcher-container ${classNameOverride}`}>
            <div ref={handleRef} className="dataBatcher">
                <div className="dataBatcher-title">Data Batcher</div>
                <div className="dataBatcher-display">
                    {displayText}
                </div>
                <div className="dataBatcher-graphic">
                        <img
                            src={dataBatcherGraphic}
                            alt="Data Batcher Graphic"
                            style={{ width: "160px", height: "auto", display: "block", margin: "0 auto" }}
                        />
                    </div>
                
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, 250, 200)}
        </div>
    );
}


//================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================
// synthetic_normal_binary_classification_500.csv
// Dataset Object
export function DatasetObject({ name, ref, handleRef, classNameOverride = "dataset-template" }) {
    return (
        <div 
            ref={ref} 
            id={name} 
            className={"dataset-container"}>

            {/* Draggable handle in the center */}
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <img
                src={synthetic1graph}
                alt="Synthetic Dataset Graph"
                className="dataset-nbc500-image"
            />
        </div>
    );
};


//dataset object that corresponds with synthetic_normal_binary_classification_500.csv
export function DatasetNBC500Object({
    name,
    ref,
    handleRef,
    classNameOverride = "dataset-container",
    datasetLabel = "Synthetic NBC 500",
    info = { Type: "Classification", Inputs: "Petal Length, Stem Height", Outputs: "Class" },
    imageSrc = synthetic1graph,
    linkStates = {}
}) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
            <div
                ref={handleRef}
                className="dataset-nbc500-interactive"
                tabIndex={0}
                role="group"
            >
                <div className="dataset-nbc500-label">{datasetLabel}</div>
                <table className="dataset-nbc500-table">
                    <tbody>
                        {Object.entries(info).map(([key, value]) => (
                            <tr key={key}>
                                <td className="dataset-nbc500-table-key">{key}</td>
                                <td className="dataset-nbc500-table-value">{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <img
                    src={imageSrc}
                    alt="Synthetic Dataset Graph"
                    className="dataset-nbc500-image"
                />
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, 400, 250)}
        </div>
    );
}

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
export function NeuronObject({ name, ref, handleRef, classNameOverride = "neuron-container", linkStates = {} }) {

    return (
        <div
            ref={ref}
            id={name}
            className={`${classNameOverride}`}
        >
            {/* Draggable handle in the center */}
            <div ref={handleRef} className="neuron">
                <p className="nodeDragText">Neuron</p>
            </div>

            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, 100, 200)}
        </div>
    );
}
//================DENSE OBJECTS ENDS HERE================================DENSE OBJECTS ENDS HERE================================DENSE OBJECTS ENDS HERE================

//================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================

// Activation Layer Object
// Neuron Object
export function ActivationObject({ name, ref, handleRef, classNameOverride = "activation-container", linkStates = {}}) {
    const isPreview = classNameOverride.includes("toolbar-preview");

    return (
        <div
            ref={ref}
            id={name}
            className={classNameOverride}
        >
            {/* Draggable handle in the center */}
            <div
                ref={handleRef}
                className={`activation${isPreview ? " toolbar-preview" : ""}`}
            >
                <p className="nodeDragText">Activation Function</p>
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, 150, 100)}
        </div>
    );
}

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
