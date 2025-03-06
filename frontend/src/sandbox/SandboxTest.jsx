import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';
import * as backend from '../backend/backend.js'
import * as dataloader from '../backend/dataloader.js' //Added by Justin.

var count = 0;
var draggables = [];
var controller = new SandboxController("poo");
var controller1 = new SandboxController("pee");

// Define test draggable
/*
function TestDraggable() {
    const draggable = document.getElementById("draggable");
    //let testdrag = new PlainDraggable(draggable);
    draggables.push(new PlainDraggable(draggable));
}
*/
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
function AddDraggable() {
    //console.log("creating count" + count + " draggable element");
    let newDiv = document.createElement("div"); // Create the div
    newDiv.id = "drag" + count;                 // Set the id of the div for referencing
    newDiv.className = "testdraggable";         // Set the classname of the div for CSS
    const newDivContent = document.createTextNode("Drag" + count);  // Create the content for the div
    newDiv.appendChild(newDivContent);          // Set the content of the div

    // Add to the stage
    const stageDiv = document.getElementById("stage");  // Get the stage div from document
    stageDiv.appendChild(newDiv);                       // Add the new div to the stage
    const poop = document.getElementById("drag" + count);   // Get the div
    draggables.push(new PlainDraggable(poop));          // Make the div draggable
    //let poopdrag = new PlainDraggable(poop);
    count += 1;                                         // Iterate the count

    // Need to run the PlainDraggable.position() method on all existing draggables
    // This recalculates the bounds that the draggables can move in
    // Without doing this, the bounds will be incorrect on some draggables
    RecalcPos();
}

// Recalculate position for all draggables
// Required for bounds to function properly
function RecalcPos() {
    draggables.forEach((thing) => {
        thing.position();
    });
}

function chooseDatasets(){
    console.log("chooseDatasets button clicked!")
    
    dataloader.checkTfVersion();
    
    //This will be used to display datasets for user to choose from.
    //dataloader.getDatasets();

    //Temporarily hardcoded chosen dataset.
    //let chosen_dataset = "heart.csv"

    //Display chosen dataset for dev purposes. More than likely won't need this in the end produc.t
    //dataloader.printCSV(chosen_dataset);

    //Obtain information about the dataset. 
    //dataloader.loadCSV();
}

function SandboxTest() {
    /*
    useEffect(() => {
        TestDraggable();
    })
    */
    useEffect(() => {
        controller.test();
        controller1.test();
    })

    return(
        <>
            <div>
                <Link to="/">Go Back</Link>
            </div>
            <button onClick={() => AddDraggable()}>Add Draggable</button>
            <button onClick={() => createBackend()}>Create Backend</button>
            <button onClick={() => createModel()}>Create Model</button>
            <button onClick={() => train()}>Train</button>
            <button onClick={() => chooseDatasets()}>Choose Dataset</button> {/*Added by Justin*/}
            {/*

            // I don't know if we still need this
            // Maybe the svg stuff can be reused

            <svg>
                <a>
                    <path id="lineAB" d="M 100 350 l 150 -300" stroke="red" strokeWidth="4"/>
                    <path id="lineBC" d="M 250 50 l 150 300" stroke="red" strokeWidth="4"/>
                    <path id="lineMID" d="M 175 200 l 150 0" stroke="green" strokeWidth="4"/>
                    <path id="lineAC" d="M 100 350 q 150 -300 300 0" stroke="blue" strokeWidth="4" fill="none"/>
                </a>
                <a>
                    <rect id="rect1" onClick={() => test("rect")} width="100" height="100" x="10" y="10" rx="10" ry="10" fill="white" />
                    <circle id="nodeConnector1" className="nodeConnector" onClick={() => test("circle")} r="4" cx="110" cy="60" />
                </a>
            </svg>
            */}
            <div id="stage" className="teststage">
                {/*
                <div id="draggable" className="testdraggable">Drag Me</div>
                */}
            </div>
        </>
    );
}

export default SandboxTest