/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney, Justin Moua
  *
  * PURPOSE: Page for the Sandbox to occupy.
  * 
  * NOTES: This file should be renamed at some point
  *        activeObjects was moved from Stage.jsx to SandboxTest.jsx so startTraning() can access object & layer info - JM
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


function startTraining(setTrainingState, activeObjects) {
    console.log("Active Objects:", activeObjects);
    createModel();
    //FIXME: This is just a test
    let fileName = 'synthetic_normal_binary_classification_500.csv';
    let problemType = 'classification';
    backend_worker.postMessage({func: 'trainModel', args: {fileName, problemType}});
    setTrainingState('training');
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
    const [list, setList] = useState([]);
    const [draggables, setDraggables] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [trainingState, setTrainingState] = useState('stopped');

    // This gets executed when the DOM is updated
    useEffect(() => {
        UpdateDraggablePos();
    })

    createBackend(); //creates backend worker

    // localized test div add
    function AddObject(type = "all") {
        // Map layer types to their corresponding snap point configurations
        const snapPointMap = {
            dataset: "r",         // Dataset can only snap at the bottom
            dense: "lr",          // Dense layer snaps left and right
            activation: "lr",     // Activation layer snaps left and right
            convolution: "lr",    // Convolution layer snaps top and bottom
            output: "l",          // Output layer can only snap at the top
            all: "all"            // Default to all snap points
        };

        // Determine the snap points for the given type
        const snapPoints = snapPointMap[type] || "all";

        // Find the next available sequential number for the given type
        const existingObjectsOfType = list.filter(obj => obj.type === type);
        const nextIndex = existingObjectsOfType.length;
        
        // Add the new object to the list
        setList(prevList => {
            const updatedList = [
                ...prevList,
                {
                    name: `${type}${nextIndex}`,
                    type: type,
                    snapType: snapPoints
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
                <NodeDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                <Stage 
                    activeObjects={activeObjects}
                    elements={list} 
                    drags={draggables} 
                    setDrags={setDraggables} 
                    updateDrags={UpdateDraggablePos} 
                    drawerOpen={drawerOpen}
                />
                <div className="bottomBar">
                    <Link to="/"><button className="sandboxButton">Go Back</button></Link>
                    <div style={
                        {
                            width:"100%",
                            paddingRight: "20px",
                            display: "inline-flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}>
                        <button className="sandboxButton" onClick={() => AddObject("dataset")}>Add Dataset</button>
                        <button className="sandboxButton" onClick={() => AddObject("dense")}>Add Dense Layer</button>
                        <button className="sandboxButton" onClick={() => AddObject("activation")}>Add Activation Layer</button>
                        <button className="sandboxButton" onClick={() => AddObject("convolution")}>Add Convolution Layer</button>
                        <button className="sandboxButton" onClick={() => AddObject("output")}>Add Output Layer</button>
                        {trainingState === 'stopped' && ( //button element is rendered if trainingState is stopped. Otherwise nothing renders.
                            <button className="sandboxButton" onClick={() => startTraining(setTrainingState, activeObjects)}>Start Training</button>
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