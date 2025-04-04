/* TestDiv.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Test node component for sandbox enviroment.
  * 
  * NOTES: Once actual nodes are created, this should be removed.
  */

import React, { forwardRef } from "react";
import test from "../../assets/test.png";

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

// Dense Layer Object
export function DenseLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable"}) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
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
            <input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Neuron Object
export function NeuronObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                width: "60px", // Set width to 50px
                height: "60px", // Set height to 50px
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#4CAF50", // Optional: Add a background color
                border: "2px solid #2E7D32", // Optional: Add a border
                borderRadius: "5px", // Optional: Slightly rounded corners
                cursor: "grab", // Indicate draggable behavior
                userSelect: "none", // Prevent text selection
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Neuron</p>
            </div>
        </div>
    );
}


// Activation Layer Object
export function ActivationLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p>Activation Function: 
                <span>
                    <select name={name + "activation"} id={name + "activation"}>
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                        <option value="softmax">Softmax</option>
                    </select>
                </span>
            </p>
            <input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p>Filter Size: 
                <span>
                    <select name={name + "filter"} id={name + "filter"}>
                        <option value="3x3">3x3</option>
                        <option value="5x5">5x5</option>
                        <option value="7x7">7x7</option>
                    </select>
                </span>
            </p>
            <input name={name + "WeightText"} id={name + "WeightText"} style={{width: "95%"}}/>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};

// Output Layer Object
export function OutputLayerObject({ name, ref, handleRef, classNameOverride = "testdraggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Output</p>
            </div>
            <p>Output Layer</p>
            { /*<img src={test} width="100" height="100" style={{ borderRadius: "5px" }} /> */ }
        </div>
    );
};
