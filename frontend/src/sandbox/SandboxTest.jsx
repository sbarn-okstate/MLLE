/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney, Justin Moua
  *
  * PURPOSE: Page for the Sandbox to occupy.
  * 
  * NOTES:
  * FIXME, in validateModel, objects don't have a type trait so I had to use object.name.startsWith
  * to determine the type of object. This is a temporary solution and should be fixed.
  */

import React, { useState, useEffect, useRef } from "react";
import { data, Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import Stage from './components/Stage.jsx';
import * as backend from '../backend/backend.js';
import snapPoints from './snapPoints.js';
import NodeDrawer from './components/NodeDrawer.jsx';

let backend_worker = null

function createBackend() {
    backend.createBackendWorker();
    backend_worker = backend.getBackendWorker();
}

function createModel() {
    //FIXME: This is just a test
    const dataset = 'synthetic_normal_binary_classification_500.csv';
    let layers = [  //replace with actual model
        {
            type: "dense",
            units: 3,
            activation: "relu"
        },
        {
            type: "dense",
            units: 2,
            activation: "relu"
        }
    ];
    backend_worker.postMessage({func: 'prepareModel', args: {layers, dataset}});
}

function startTraining(setTrainingState) {
    if (true) { //FIXME: check if model is valid
        createModel();
        //FIXME: This is just a test
        let fileName = 'synthetic_normal_binary_classification_500.csv';
        let problemType = 'classification';
        backend_worker.postMessage({func: 'trainModel', args: {fileName, problemType}});
        setTrainingState('training');
    } else {
        console.error("Chain of objects not validated!");
    }
}

function pauseTraining(setTrainingState) {
    backend_worker.postMessage({func: 'pauseTraining'});
    setTrainingState('paused');
}

function resumeTraining(setTrainingState) {
    backend_worker.postMessage({func: 'resumeTraining'});
    setTrainingState('training');
}

function stopTraining(setTrainingState) {
    backend_worker.postMessage({func: 'stopTraining'});
    setTrainingState('stopped');
}

function SandboxTest() {
    const activeObjects = useRef([]);
    const [count, setCount] = useState(0);
    const [list, setList] = useState([
        { name: "startNode", type: "startNode", snapType: "lr" }, // Add startNode here
    ]);
    const [draggables, setDraggables] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [trainingState, setTrainingState] = useState('stopped');
    const [modelState, setModelState] = useState('invalid');

    const stageRef = useRef(null); // Reference to the stage component

    // This gets executed when the DOM is updated
    useEffect(() => {
        UpdateDraggablePos();
    })

    createBackend(); //creates backend worker
    // Function to validate the chain of linked objects

    const validateModel = () => {
        if (!stageRef.current) {
            console.error("Stage reference is not available!");
            return [];
        }
    
        const startNode = stageRef.current.getStartNode();
        if (!startNode) {
            console.error("Start node not found!");
            return [];
        }
    
        const chain = [];
    
        // Helper function to get field values
        const getFieldValue = (fieldId) => {
            const field = document.getElementById(fieldId);
            return field ? field.value : null;
        };
    
        // Traverse the left link for the dataset object
        let currentObject = startNode.leftLink;
        if (currentObject.objectType === "dataset") {
            const datasetValue = getFieldValue(currentObject.id);
            chain.push({
                objectType: currentObject.objectType,
                value: datasetValue,
            });
        } else {
            console.error("No dataset object linked to the left of the start node!");
            return chain;
        }
    
        // Traverse the right link for other objects
        currentObject = startNode.rightLink;
        while (currentObject) {
            const objectData = { objectType: currentObject.objectType };
    
            // Read specific field values based on the object type
            if (currentObject.objectType === "dense"){
                objectData.nodes = getFieldValue(currentObject.id);
            } else if (currentObject.objectType === "activation") {
                objectData.activation = getFieldValue(currentObject.id);
            } else if (currentObject.objectType === "convolution") {
                objectData.filter = getFieldValue(currentObject.id);
            }
    
            chain.push(objectData);
            if (!currentObject.rightLink && currentObject.objectType == "output") {
                setModelState('valid');
                break;
            } else {
                currentObject = currentObject.rightLink; // Move to the next object
            }
        }

        console.log("Chain of objects:", chain);
        return chain;
    };

    // localized test div add
    function AddObject(objectType = "all") {
        // Map layer types to their corresponding snap point configurations
        const snapTypeMap = {
            dataset: "r",         // Dataset can only snap at the bottom
            dense: "lr",          // Dense layer snaps left and right
            activation: "lr",     // Activation layer snaps left and right
            convolution: "lr",    // Convolution layer snaps top and bottom
            output: "l",          // Output layer can only snap at the top
            all: "all"            // Default to all snap points
        };

        const snapType = snapTypeMap[objectType] || "all";
        // Determine the snap points for the given type
        //console.log("Snap points:", snapPoints); // Debugging log
        // Add the new object to the list
        setList(prevList => {
            const updatedList = [
                ...prevList,
                {
                    id: count,
                    objectType,
                    snapType
                }
            ];
            console.log("Updated list:", updatedList); // Debugging log
            return updatedList;
        });

        setCount(count + 1);
    };

    // Recalculate position for all draggables
    // Required for bounds to function properly
    function UpdateDraggablePos() {
        draggables.forEach((thing) => {
            thing.position();
        });
    };

    return(
        <>
            <div className="sandboxContainer">
                <NodeDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} createNodeFunction={AddObject}/>
                <Stage
                    ref={stageRef}
                    elements={list} 
                    drags={draggables} 
                    setDrags={setDraggables} 
                    updateDrags={UpdateDraggablePos} 
                    drawerOpen={drawerOpen}
                />
                <div className="bottomBar">
                    <Link to="/"><button className="sandboxButton">Go Back</button></Link>
                    <div style={{
                            width:"100%",
                            paddingRight: "20px",
                            display: "inline-flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}>
                        <button className="sandboxButton" onClick={validateModel}>Validate Model</button>
                        {trainingState === 'stopped' && (
                            <button className="sandboxButton" onClick={() => startTraining(setTrainingState)}>Start Training</button>
                        )}
                        {trainingState === 'training' && (
                            <>
                                <button className="sandboxButton" onClick={() => pauseTraining(setTrainingState)}>Pause Training</button>
                                <button className="sandboxButton" onClick={() => stopTraining(setTrainingState)}>Stop Training</button>
                            </>
                        )}
                        {trainingState === 'paused' && (
                            <>
                                <button className="sandboxButton" onClick={() => resumeTraining(setTrainingState)}>Resume Training</button>
                                <button className="sandboxButton" onClick={() => stopTraining(setTrainingState)}>Stop Training</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default SandboxTest