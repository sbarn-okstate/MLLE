import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import Stage from './components/Stage.jsx';
import * as backend from '../backend/backend.js';
import snapPoints from './snapPoints.js';

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
            units: 8,
            activation: "relu"
        },
        {
            type: "dense",
            units: 2,
            activation: "relu"
        },
        {
            type: "dense",
            units: 1,
        }
    ];
    backend_worker.postMessage({func: 'prepareModel', args: test_model})
}

function train() {
    //FIXME: This is just a test
    let fileName = 'synthetic_normal_binary_classification.csv';
    let problemType = 'classification';
    backend_worker.postMessage({func: 'trainModel', args: {fileName, problemType}});
}

function SandboxTest() {
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);
    const [draggables, setDraggables] = useState([]);

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
            <div>
                <Link to="/">Go Back</Link>
            </div>
            <button onClick={() => AddTestDiv()}>Add Draggable</button>
            <button onClick={() => createBackend()}>Create Backend</button>
            <button onClick={() => createModel()}>Create Model</button>
            <button onClick={() => train()}>Train</button>

            <Stage elements={list} drags={draggables} setDrags={setDraggables} updateDrags={UpdateDraggablePos}/>
            
        </>
    );
}
export default SandboxTest