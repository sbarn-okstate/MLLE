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
//      onDatasetChange is a function from Stage.jsx (parent of LayerObjects.jsx)
//      that takes the name of the dataset object and the selected value.
export function DatasetObject({ name, ref, handleRef, onDatasetChange}) {
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onDatasetChange(name, selectedValue); // Pass the selected value to the parent
    };
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Dataset: 
                <span>
                    <select name={name + "dataset"} id={name + "dataset"} onChange={handleChange}>
                        <option value="dataset1.csv">Dataset 1</option>
                        <option value="dataset2.csv">Dataset 2</option>
                        <option value="dataset3.csv">Dataset 3</option>
                    </select>
                </span>
            </p>
            <img src={test} width="100" height="150" style={{ borderRadius: "5px" }} />
        </div>
    );
};

// Dense Layer Object
export function DenseLayerObject({ name, ref, handleRef, onNumOfNodesChange }) {
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onNumOfNodesChange(name, selectedValue); // Pass the selected value to the parent
    };
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Number of Nodes: 
                <span>
                    <input
                        type="number"
                        name={name + "nodes"}
                        id={name + "nodes"}
                        min="1"
                        max="1024"
                        defaultValue="128"
                        style={{ width: "60px" }}
                        onChange={handleChange}
                    />
                </span>
            </p>
            <img src={test} width="100" height="100" style={{ borderRadius: "5px" }} />
        </div>
    );
};

// Activation Layer Object
export function ActivationLayerObject({ name, ref, handleRef, onActivationLayerChange }) {
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onActivationLayerChange(name, selectedValue); // Pass the selected value to the parent
    };
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Activation Function: 
                <span>
                    <select name={name + "activation"} id={name + "activation"} onChange={handleChange}> 
                        <option value="relu">ReLU</option>
                        <option value="sigmoid">Sigmoid</option>
                        <option value="tanh">Tanh</option>
                        <option value="softmax">Softmax</option>
                    </select>
                </span>
            </p>
            <img src={test} width="100" height="100" style={{ borderRadius: "5px" }} />
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayerObject({ name, ref, handleRef, onFilterSizeChange }) {
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        onFilterSizeChange(name, selectedValue); // Pass the selected value to the parent
    };
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Filter Size: 
                <span>
                    <select name={name + "filter"} id={name + "filter"} onChange={handleChange}>
                        <option value="3x3">3x3</option>
                        <option value="5x5">5x5</option>
                        <option value="7x7">7x7</option>
                    </select>
                </span>
            </p>
            <img src={test} width="100" height="100" style={{ borderRadius: "5px" }} />
        </div>
    );
};

// Output Layer Object
export function OutputLayerObject({ name, ref, handleRef }) {
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Output Layer</p>
            <img src={test} width="100" height="80" style={{ borderRadius: "5px" }} />
        </div>
    );
};
