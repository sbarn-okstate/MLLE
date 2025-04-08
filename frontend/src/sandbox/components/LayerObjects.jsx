/* TestDiv.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua, Samuel Barney
  *
  * PURPOSE: Test node component for sandbox enviroment.
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
import test from "../../assets/test.png";
import "./LayerObjects.css";

import closedLink from "../../assets/closed.png";
import openLink from "../../assets/open.png";

// Helper function to render all link indicators
export function renderLinkIndicators(linkStates) {
    const positionToAltText = {
        top: "Top Link",
        right: "Right Link",
        bottom: "Bottom Link",
        left: "Left Link",
    };

    return Object.entries(linkStates).map(([position, value]) => {
        if (value === 0) {
            return null; // No image for 0
        }

        const src = value ? closedLink : openLink; // closedLink for true, openLink for null
        const alt = positionToAltText[position] || "Link"; // Use predefined alt text or fallback to "Link"

        return (
            <img
                key={position} // Use position as the key
                src={src}
                alt={alt}
                className={`link-indicator ${position}-link`}
            />
        );
    });
}

//================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================DATASET OBJECTS START HERE======================
// synthetic_normal_binary_classification_500.csv
// Dataset Object
export function DatasetObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
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
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};
//dataset object that corresponds with synthetic_normal_binary_classification_500.csv
export function DatasetNBC500Object({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> synthetic dataset<br/><br/>synthetic_normal_binary_classification_500.csv
                {/*
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
                */}
            </p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

//dataset object that corresponds with synthetic_normal_binary_classification_500.csv
export function DatasetHeartPredictionObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Heart Prediction Dataset<br/><br/>heart.csv
                {/*
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
                */}
            </p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

export function DatasetBostonHousingObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Boston Housing Dataset<br/><br/>boston-housing-train.csv
                {/*
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
                */}
            </p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

export function DatasetMNISTObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> MNIST Dataset<br/><br/>mnist_train.csv
                {/*
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
                */}
            </p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};


export function DatasetFashionMNISTObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
                    style={{
                backgroundColor: "rgb(255, 88, 88)", // Optional: Add a background color
            }}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dataset</p>
            </div>
            <p style={{ maxWidth: "150px", whiteSpace: "normal", wordWrap: "break-word" }}> Fashion MNIST Dataset<br/><br/>fashion-mnist_train.csv
                {/*
                <span>
                    <select name={name + "dataset"} id={name + "dataset"}>
                        <option value="synthetic_normal_binary_classification_500.csv">synth_normal_binary</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
                */}
            </p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};
//================DATASET OBJECTS ENDS HERE======================DATASET OBJECTS ENDS HERE======================DATASET OBJECTS ENDS HERE======================

//================DENSE OBJECTS START HERE================================DENSE OBJECTS START HERE================================DENSE OBJECTS START HERE================
// Dense Layer Object
export function DenseLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable", text = "placeholder" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "#4CAF50", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dense Layer</p>
            </div>
            <p>Number of Nodes: 
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
            
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Neuron Object
export function NeuronObject({ name, ref, handleRef, classNameOverride = "testdraggable", linkStates = {} }) {

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
export function ActivationLayerObject({ activationName, name, ref, handleRef, classNameOverride = "testdraggable",}) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(0,153,255)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer {activationName}</p>
            </div>
            <p>
                activation type: {activationName}
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
            
        </div>
    );
};

export function ReluObject({ name, ref, handleRef, classNameOverride = "testdraggable",  linkStates = {}  }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p>
                ReLu
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
            {renderLinkIndicators(linkStates)}
        </div>
    );
}

export function SigmoidObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p>
                Sigmoid
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
}

export function TanhObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p>
                Tanh
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
}

export function SoftmaxObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p>
                Softmax
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
}
//================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================

//================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================
// // Convolution Layer Object
export function ConvolutionLayerObject({filterSize, name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p>{filterSize} Filter size
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

//Convolution Layer Object
export function ConvolutionLayer3x3Object({name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p>Filter Size of 3x3
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer5x5Object({name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p>Filter Size of 5x5
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer7x7Object({name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p>Filter Size of 7x7
            </p>
            {/*<input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>*/}
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};
//================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================

// Output Layer Object
export function OutputLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(255, 140, 0)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Output</p>
            </div>
            <p>Output Layer</p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};
