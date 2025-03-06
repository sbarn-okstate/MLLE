import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import Stage from './components/Stage.jsx';
import * as backend from '../backend/backend.js'

//var count = 0;
//var draggables = [];

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

// Programmatically add draggable
/*
function AddDraggable() {
    //console.log("creating count" + count + " draggable element");
    //let newDiv = document.createElement("div"); // Create the div
    //newDiv.id = "drag" + count;                 // Set the id of the div for referencing
    //newDiv.className = "testdraggable";         // Set the classname of the div for CSS
    //const newDivContent = document.createTextNode("Drag" + count);  // Create the content for the div
    //newDiv.appendChild(newDivContent);          // Set the content of the div

    //item.push({<TestDiv name={"drag" + count}></TestDiv>});

    // Add to the stage
    //const stageDiv = document.getElementById("stage");  // Get the stage div from document
    //stageDiv.appendChild(newDiv);                       // Add the new div to the stage
    //const poop = document.getElementById("drag" + count);   // Get the div
    draggables.push(new PlainDraggable(newDiv));          // Make the div draggable
    //let poopdrag = new PlainDraggable(poop);
    count += 1;                                         // Iterate the count

    // Need to run the PlainDraggable.position() method on all existing draggables
    // This recalculates the bounds that the draggables can move in
    // Without doing this, the bounds will be incorrect on some draggables
    RecalcPos();
}
*/



// Recalculate position for all draggables
// Required for bounds to function properly
function RecalcPos() {
    draggables.forEach((thing) => {
        thing.position();
    });
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