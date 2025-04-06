/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney, Justin Moua
  *
  * PURPOSE: Page for the Sandbox to occupy.
  * 
  * NOTES:
  * 
  *     SandboxTest.jsx Strcture:
  * *       - createBackend(): Creates the backend worker.
  * *       - createModel(): Creates the model for the backend worker.  
  * *       - startTraining(): Starts the training process.
  * *       - pauseTraining(): Pauses the training process.
  * *       - resumeTraining(): Resumes the training process.
  * *       - stopTraining(): Stops the training process.
  * *       - SandboxTest(): The main function that creates the sandbox page.
  * * *             - validateModel(): Validates the model by checking the chain of linked objects.
  * * *             - AddObject(): Adds an object to the list of objects on the stage.
  * * *                     - Takes in three optional parameters: objectType, subType, and datasetFileName.
  * * * *                           - objectType: The type of object to create. (dataset, dense, activation, convolution, output)
  * * * *                           - subType: The subtype of the object to create. (e.g. relu, sigmoid, tanh, softmax, 3x3, 5x5, 7x7)
  * * * * *                         - datasetFileName: The name of the file to use. (e.g. synthetic_normal_binary_classification_500.csv)
  * * *             - UpdateDraggablePos(): Updates the position of the draggable objects.
  * * *             - return: Returns the JSX for the sandbox page.
  * * * *                   - Returns NodeDrawer, Stage, and bottom bar with options.
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
let model = null

function createBackend() {
    backend.createBackendWorker();
    backend_worker = backend.getBackendWorker();
}

function createModel() {
    //FIXME: This is just a test
    const dataset = model[0].dataset;
    let layers = model.slice(1);
    backend_worker.postMessage({func: 'prepareModel', args: {layers, dataset}});
}

function startTraining(setTrainingState, modelState) {
    if (modelState === 'valid') { //FIXME: check if model is valid
        createModel();
        //FIXME: This is just a test
        let fileName = model[0].dataset;
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
    const [count, setCount] = useState(1); // Start from 1 to avoid collision with startNode
    const [list, setList] = useState([
        { id: "startNode", objectType: "startNode", snapType: "lr" }, // Add startNode here
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
        setModelState('invalid');

        const startNode = stageRef.current.getStartNode();
        if (!startNode) {
            console.error("Start node not found!");
            return [];
        }
    
        const chain = [];
    
        // Helper function to get field values
        const getFieldValue = (fieldId) => {
            const field = document.getElementById(fieldId);
            
            if (field && field.type && field.type === "number") {
                return Number(field.value); // Convert to a number
            }
            return field ? field.value : null;
        };
    
        // Traverse the left link for the dataset object
        let currentObject = startNode.leftLink;
        if (currentObject.objectType === "dataset") {
            //const datasetValue = getFieldValue(currentObject.name + "dataset");
            const datasetValue = currentObject.datasetFileName;
            chain.push({
                type: currentObject.objectType,
                dataset: datasetValue,
            });
        } else {
            console.error("No dataset object linked to the left of the start node!");
            return chain;
        }
    
        // Traverse the right link for other objects
        currentObject = startNode.rightLink;
        while (currentObject) {
            const objectData = { type: currentObject.objectType };
            
            // Handle activation function not preceded by a layer
            if (currentObject.objectType === "activation") {
                console.log("Invalid activation function");
                setModelState('invalid');
                break;
            }
 
            // Handle Dense Layer
            if (currentObject.objectType === "dense"){
                objectData.units = getFieldValue(currentObject.name + "units");
            } 
            // Handle Stacked Neurons
            else if (currentObject.objectType === "neuron") {
                let units = 1;
                let nextNeuron = currentObject.topLink
                while (nextNeuron) {
                    units++;
                    nextNeuron = nextNeuron.topLink;
                }
                nextNeuron = currentObject.bottomLink;
                while (nextNeuron) {
                    units++;
                    nextNeuron = nextNeuron.bottomLink;
                }
                objectData.units = units;
                objectData.type = "dense";
            } 
            // Handle Convolution Layer
            else if (currentObject.objectType === "convolution") {
                objectData.filter = getFieldValue(currentObject.name + "filter");
            }
            
            // Handle Activation Function following any layer
            if (currentObject.rightLink && currentObject.rightLink.objectType === "activation") {
                //objectData.activation = currentObject.rightLink.subType;
                objectData.activation = currentObject.rightLink.subType;
                currentObject = currentObject.rightLink; // move to activation object
            }

            // Handle Output Layer
            if (!currentObject.rightLink && currentObject.objectType == "output") {
                setModelState('valid');
                console.log("Model validated successfully!");
                break;
            } else {
                currentObject = currentObject.rightLink; // Move to the next object
            }
            chain.push(objectData);
        }

        model = chain;
        console.log("Chain of objects:", chain);
        return chain;
    };

    // localized test div add
    //objectType and subType are passed in from the NodeDrawer component in NodeDrawer.jsx
    //This is because NodeDrawer calls the AddObject function when a user selects a node.
    /*
    addObject takes in three possible parameters. They are:
        - objectType, subType, and datasetFileName.
            - objectType: The type of object to create. (dataset, dense, activation, convolution, output)
            - subType: The subtype of the object to create. (e.g. relu, sigmoid, tanh, softmax, 3x3, 5x5, 7x7)  
            - datasetFileName: The name of the file to use. (e.g. synthetic_normal_binary_classification_500.csv)
    */
    function AddObject(objectType = "all", subType = "all", datasetFileName = "none") {
        // Map layer types to their corresponding snap point configurations
        const snapTypeMap = {
            dataset: "r",         // Dataset can only snap at the bottom
            dense: "lr",          // Dense layer snaps left and right
            activation: "lr",     // Activation layer snaps left and right
            relu: "lr",                 // Might not need this. Have to do testing later to see if we can remove this. 
            sigmoid: "lr",              // Might not need this. Have to do testing later to see if we can remove this. 
            tanh: "lr",                 // Might not need this. Have to do testing later to see if we can remove this. 
            softmax: "lr",              // Might not need this. Have to do testing later to see if we can remove this. 
            convolution: "lr",    // Convolution layer snaps top and bottom
            filter3x3: "lr",            // Might not need this. Have to do testing later to see if we can remove this. 
            filter5x5: "lr",            // Might not need this. Have to do testing later to see if we can remove this. 
            filter7x7: "lr",            // Might not need this. Have to do testing later to see if we can remove this. 
            output: "l",          // Output layer can only snap at the top
            neuron: "all",        // Neuron can snap at all points
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
                    objectType, //passed in from NodeDrawer.jsx
                    subType, //passed in from NodeDrawer.jsx
                    datasetFileName,
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
                {/*NodeDrawer is a component that has three props passed into it 
                    the three proprs are drawerOpen, setDrawerOpen, and createNodeFunction.
                    createNodeFunction specifically passes the "AddObject" function into NodeDrawer.
                    This way, NodeDrawer can call "AddObject" when a use selects a node.*/}
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
                            <button className="sandboxButton" onClick={() => startTraining(setTrainingState, modelState)}>Start Training</button>
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