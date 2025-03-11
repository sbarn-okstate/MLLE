import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import Stage from './components/Stage.jsx';
import * as backend from '../backend/backend.js'

let backend_worker = null

function createBackend() {
    backend.createBackendWorker();
    backend_worker = backend.getBackendWorker();
}

function createModel() {
    //FIXME: This is just a test
    console.log("Button 2 pressed!");
    let test_model = [
        {
            type: "dense",
            inputShape: [5],
            units: 128,
            activation: "relu"
        },
        {
            type: "dropout",
            rate: 0.2
        },
        {
            type: "dense",
            units: 64,
            activation: "relu"
        },
        {
            type: "dense",
            units: 32,
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
    let xs = [1,2,3,4,5]  // Input data
    let ys = [1,3,5,7,9]; // Expected output 
    backend_worker.postMessage({func: 'trainModel', args: {xs: xs, ys: ys}});
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