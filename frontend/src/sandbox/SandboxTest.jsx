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

    //Made as function for easier readability. 
    function displayDatasetsToConsole(availableDatasets){
        //Below is only displayed in the console.

        //Would like to display these datasets as buttons, scrollable list,
        //or some form of clickable object for the user to select from.
        console.log("Available Datasets:\n--------------------");
        availableDatasets.forEach((value, key) => {
            console.log(`File Name: ${key}\n    - Problem Type: ${value}`);
        });
        console.log("--------------------");
    }

    //Made as function for easier readability. 
    function displayDatasetsToUi(availableDatasets){
        //============DISPLAY DATASETS TO GUI STARTS HERE==========
        //Below is displayed in the frontend UI
        // create a new div element
        const newDiv = document.createElement("div");
        newDiv.appendChild(document.createTextNode("Please choose a dataset from below:"));
        newDiv.appendChild(document.createElement("br"));
        newDiv.appendChild(document.createElement("br"));

        // and give it some content
        availableDatasets.forEach((value, key) => {
            const foundedFileName = document.createTextNode(`File Name: ${key} | Problem Type: ${value}\n`);
            newDiv.appendChild(foundedFileName);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(document.createElement("br"));
        });
        // add the text node to the newly created div


        // add the newly created element and its content into the DOM
        const currentDiv = document.getElementById("div1");
        document.body.insertBefore(newDiv, currentDiv);
        //============DISPLAY DATASETS TO GUI ENDS HERE==========
    }
  
    //Obtain all available datasets.
        //Might be better to read from MLLE\frontend\public\datasets. But I researched online and there doesn't seem to be a sure way of doing so
        //unless we are doing things from the server side via Node.JS. Maybe it can be done later in our end product, implementing a database. - Justin
    let availableDatasets = new Map(); //In the form of {file name, problem type}
    availableDatasets.set("boston-housing-train.csv", "regr");
    availableDatasets.set("heart.csv", "clsf");
    availableDatasets.set("iris_training.csv", "img clsf");

    //Display available datasets to choose from.
    displayDatasetsToConsole(availableDatasets);
    displayDatasetsToUi(availableDatasets)

    //User selects dataset here.
        //We obtain the respective dataset's file name and problem type.
    let fileName = "heart.csv"; //This will later be replaced with some sort of checker. 
    let problemType = availableDatasets.get(fileName);

    //Output selected dataset to user.
    console.log("You have selected", fileName + "!"); //Displayed to console, not UI.
    console.log(fileName + "'s problem type is:", problemType); //Displayed to console, not UI.

    //Begin obtaining dataset to be imported. This is done via csvDataset.
    backend_worker.postMessage({func: 'chooseDataset', args: [fileName, problemType]});
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