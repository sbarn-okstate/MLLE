/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney
  *
  * PURPOSE: Page for the Sandbox to occupy.
  * 
  * NOTES: This file should be renamed at some point
  */

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
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
    let test_model = [  //replace with actual model
        {
            type: "dense",
            inputShape: [2], //retrieve from input dataset
            units: 2,
            activation: "relu"
        },
        {
            type: "dense",
            units: 1,
            activation: "sigmoid"
        }
    ];
    backend_worker.postMessage({func: 'prepareModel', args: test_model})
}

function startTraining(setTrainingState) {
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
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);
    const [draggables, setDraggables] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [trainingState, setTrainingState] = useState('stopped');

    // This gets executed when the DOM is updated
    useEffect(() => {
        UpdateDraggablePos();
    })

    // localized test div add
    function AddTestDiv() {
        setList([
            ...list,
            {
                name: "drag" + count
            }
        ])

        setCount(count + 1);
    }

    // Recalculate position for all draggables
    // Required for bounds to function properly
    function UpdateDraggablePos() {
        draggables.forEach((thing) => {
            thing.position();
        });
    }

    return(
        <>
            <div className="sandboxContainer">
                <NodeDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                <Stage elements={list} drags={draggables} setDrags={setDraggables} updateDrags={UpdateDraggablePos} drawerOpen={drawerOpen}/>
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
                        <button className="sandboxButton" onClick={() => AddTestDiv()}>Add Draggable</button>
                        <button className="sandboxButton" onClick={() => createBackend()}>Create Backend</button>
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