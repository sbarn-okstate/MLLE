import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './SandboxTest.css';
import SandboxController from './SandboxController.jsx';

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


function button1() {
    console.log("Button 1 pressed!");
}

function button2() {
    console.log("Button 2 pressed!");
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
            <button onClick={() => button1()}>Button 1</button>
            <button onClick={() => button2()}>Button 2</button>
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