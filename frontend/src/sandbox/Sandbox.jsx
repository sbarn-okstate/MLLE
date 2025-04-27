/* Sandbox.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney, Justin Moua
  *
  * PURPOSE: Page for the Sandbox to occupy.
  * 
  * Sandbox.jsx Strcture:
  *     - createBackend(): Creates the backend worker.
  *     - createModel(): Creates the model for the backend worker.  
  *     - startTraining(): Starts the training process.
  *     - pauseTraining(): Pauses the training process.
  *     - resumeTraining(): Resumes the training process.
  *     - stopTraining(): Stops the training process.
  *     - Sandbox(): The main function that creates the sandbox page.
  * *           - validateModel(): Validates the model by checking the chain of linked objects.
  * *           - AddObject(): Adds an object to the list of objects on the stage.
  * *                   - Takes in three optional parameters: objectType, subType, and datasetFileName.
  * * *                         - objectType: The type of object to create. (dataset, dense, activation, convolution, output)
  * * *                         - subType: The subtype of the object to create. (e.g. relu, sigmoid, tanh, softmax, 3x3, 5x5, 7x7)
  * * * *                       - datasetFileName: The name of the file to use. (e.g. synthetic_normal_binary_classification_500.csv)
  * *           - UpdateDraggablePos(): Updates the position of the draggable objects.
  * *           - return: Returns the JSX for the sandbox page.
  * * *                 - Returns NodeDrawer, Stage, and bottom bar with options. 
  * 
  * =====
  * NOTES
  * =====
  * 4/13/2025 (Justin) - Pretrained models can now be read and have their training simulated on the training report graph
  *                      Currently, there is a stored sample model in D:\GitHub\MLLE\frontend\public\json\sampleModel.json. To simulate its
  *                      training, the "validate model" needs to be clicked first. Otherwise, the information being read from the pretrained model
  *                      will not be read. This is when the information is passed to the training report graph, it goes through the same code
  *                      that the "start training" button does where a validation of the model must have occured. **NOTE** that this DOES NOT affect
  *                      "start training" from running if you are wanting to create a model that does not match the pretrained model. 
  * 
*/

import React, { useState, useEffect, useRef } from "react";
import { data, Link } from "react-router";
import PlainDraggable from "plain-draggable";
import './Sandbox.css';
import Stage from './components/Stage.jsx';
import * as backend from '../backend/backend.js';
import NodeDrawer from './components/NodeDrawer.jsx';
import Status from './components/Status.jsx';
import Report from './components/Report.jsx';
import Toolbar from './components/Toolbar.jsx';
import fullscreenOut from '../assets/fullscreen-out.svg';
import fullscreenIn from '../assets/fullscreen-in.svg';
import ReactDOM from "react-dom";


let backend_worker = null;
let model = null;
let savePretrained = false;

const OverlayRoot = document.getElementById("overlay-root");

const Overlay = ({ children, onClose }) => { //Refer to https://stackoverflow.com/questions/61749580/how-to-create-an-overlay-with-react
  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="overlayContent" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="closeButton" onClick={onClose}>Close</button>
      </div>
    </div>,
    OverlayRoot
  );
};

console.log("savePretrained default:", savePretrained);
function savePretrainedSwitcher() {
    if (savePretrained === false) {
        savePretrained = true;
    }
    else {
        savePretrained = false;
    }
    console.log("savePretrained is now:", savePretrained);
    return;
}

function createBackend(updateMetricsCallback, updateWeightsCallback) {
    backend.createBackendWorker(updateMetricsCallback, updateWeightsCallback);
    backend_worker = backend.getBackendWorker();
}

//called by validateModel() to create the model.
function createModel() {
    //FIXME: This is just a test
    const dataset = model[0].dataset;
    console.log("dataset in createModel() is:", dataset);
    let layers = model.slice(1);
    backend_worker.postMessage({func: 'prepareModel', args: {layers, dataset}});
}

function startTraining(setTrainingState, setChangeStartTrainingBtnColor, setChangeStopTrainingBtnColor, setChangePauseTrainingBtnColor, modelState, setStatusContent, chainOfObjects, stageRef) {
    if (modelState === 'valid') { //FIXME: check if model is valid
        let fileName = model[0].dataset; 
        console.log("fileName in startTraining() is:", fileName);
        let problemType = 'classification';
        backend_worker.postMessage({func: 'trainModel', args: {fileName, problemType, chainOfObjects, savePretrained}}); //Goes to worker.js
        setTrainingState('training');
        setChangeStartTrainingBtnColor("defaultSandboxButton");
        setChangeStopTrainingBtnColor("redSandboxButton");
        setChangePauseTrainingBtnColor("orangeSandboxButton");
        setStatusContent([
            "Training started!",
            "Click 'Pause Training' to pause.",
        ]);

        // Create the LinkerLines
        stageRef.current.createLinkerLines();
    } else {
        console.error("Chain of objects not validated!");
        setStatusContent([
            "Chain of objects not validated!",
            "Please validate your model before starting training.",
        ]);
    }
}

function pauseTraining(setTrainingState, setChangeResumeTrainingBtnColor, setStatusContent, stageRef) {
    backend_worker.postMessage({func: 'pauseTraining'});
    setTrainingState('paused');
    setStatusContent([
        "Training paused.",
        "Click 'Resume Training' to continue.",
    ]);
    setChangeResumeTrainingBtnColor("greenSandboxButton")
    stageRef.current.stopAnimLinkerLines();
}

function resumeTraining(setTrainingState, setChangePauseTrainingBtnColor, stageRef) {
    backend_worker.postMessage({func: 'resumeTraining'});
    setTrainingState('training');
    setChangePauseTrainingBtnColor("orangeSandboxButton")

    stageRef.current.startAnimLinkerLines();
}

function stopTraining(setTrainingState, setChangeValidateModelBtnColor, setChangeStartTrainingBtnColor, setStatusContent, reportRef, stageRef) {
    backend_worker.postMessage({func: 'stopTraining'});
    setTrainingState('stopped');
    setChangeValidateModelBtnColor("greenSandboxButton");
    setChangeStartTrainingBtnColor("redSandboxButton");
    setStatusContent([
        "Welcome to the Sandbox!",
        "Validate your model to start training.",
    ]);
    reportRef.current.clearGraphData(); // Clear the graph data

    stageRef.current.stopAnimLinkerLines();
    stageRef.current.retractLinkerLines();
}

function Sandbox() {
    const activeObjects = useRef([]);
    const [count, setCount] = useState(1); // Start from 1 to avoid collision with dataBatcher
    const [list, setList] = useState([]); // List of objects on the stage]);
    const [draggables, setDraggables] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [trainingState, setTrainingState] = useState('stopped');
    const [modelState, setModelState] = useState('invalid');
    const [statusContent, setStatusContent] = useState([
        "Welcome to the Sandbox!",
        "Validate your model to start training.",
    ]);
    const [showStatusAndReport, setShowStatusAndReport] = useState(true); // State to toggle visibility
    const [changeValidateModelBtnColor, setChangeValidateModelBtnColor] = useState("greenSandboxButton");
    const [changeStartTrainingModelBtnColor, setChangeStartTrainingBtnColor] = useState("redSandboxButton");
    const [changeStopTrainingModelBtnColor, setChangeStopTrainingBtnColor] = useState("redSandboxButton")
    const [changePauseTrainingModelBtnColor, setChangePauseTrainingBtnColor] = useState("orangeSandboxButton")
    const [changeResumeTrainingModelBtnColor, setChangeResumeTrainingBtnColor] = useState("greenSandboxButton")
    const [openHelp, setOpenHelp] = React.useState(false);

    const toggleStatusAndReport = () => {
        setShowStatusAndReport((prev) => !prev); // Toggle the state
    };

    const reportRef = useRef(null);
    const stageRef = useRef(null); // Reference to the stage component

    // Scrollable wrapper ref
    // This is used to scroll the stage to the center when the component mounts
    const scrollWrapperRef = useRef(null);
    useEffect(() => {
        if (scrollWrapperRef.current) {
            // Scroll to half the scrollable height
            const wrapper = scrollWrapperRef.current;
            wrapper.scrollTop = (wrapper.scrollHeight / 2) - (wrapper.clientHeight / 2);
            wrapper.scrollLeft = (wrapper.scrollWidth / 2) - (wrapper.clientWidth / 2); // adjust as needed
        }
    }, []);

    // Fullscreen handler
    const [isFullscreen, setIsFullscreen] = useState(false);
    const handleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) elem.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    // Listen for fullscreen changes to update button icon
    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
        }
        document.addEventListener("fullscreenchange", onFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);
    
    // This gets executed when the DOM is updated
    useEffect(() => {
        UpdateDraggablePos();
    })

    const updateMetricsCallback = (epoch, loss, accuracy) => {
        updateGraphData(epoch, accuracy); // Pass accuracy to the graph
        updateAccuracy(accuracy); // Update the accuracy percentage
    }

    const updateGraphData = (epoch, accuracy) => {
        if (reportRef.current) {
            reportRef.current.addGraphData(epoch, accuracy);
        }
    };

    const updateAccuracy = (accuracy) => {
        if (reportRef.current) {
            reportRef.current.updateAccuracy(accuracy);
        }
    };

    const updateWeightsCallback = (weights) => {
        //console.log("Weights updated:", weights);
    }

    createBackend(updateMetricsCallback, updateWeightsCallback);

    

    const validateModel = () => {
        if (!stageRef.current) {
            console.error("Stage reference is not available!");
            return [];
        } 
        setModelState('invalid');

        const dataBatcher = stageRef.current.getDataBatcher();
        if (!dataBatcher) {
            console.error("Data batcher not found!");
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
        let currentObject = dataBatcher.leftLink;
        if (currentObject && currentObject.objectType === "dataset") {
            //const datasetValue = getFieldValue(currentObject.name + "dataset");
            const datasetValue = currentObject.datasetFileName;
            chain.push({
                type: currentObject.objectType,
                dataset: datasetValue,
            });
        } else {
            console.error("No dataset object linked to the left of the data batcher!");
            setStatusContent([
                "Missing dataset object.",
                "Please link a dataset object to the left of the data batcher.",
            ]);
            return chain;
        }
    
        // Traverse the right link for other objects
        currentObject = dataBatcher.rightLink;
        while (currentObject) {
            const objectData = { type: currentObject.objectType };
            
            // Handle activation function not preceded by a layer
            if (currentObject.objectType === "activation") {
                console.log("Invalid activation function");
                setModelState('invalid');
                setStatusContent([
                    "Invalid activation function.",
                    "Activation functions must be preceded by a layer.",
                ]);
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
                //objectData.filter = getFieldValue(currentObject.name + "filter");
                objectData.filter = currentObject.subType;
            }
            
            // Handle Activation Function following any layer
            if (currentObject.rightLink && currentObject.rightLink.objectType === "activation") {
                //objectData.activation = currentObject.rightLink.subType;
                objectData.activation = currentObject.rightLink.subType;
                currentObject = currentObject.rightLink; // move to activation object
            }

            // Handle Output Layer
            if (!currentObject.rightLink) {
                if (currentObject.objectType === "output") {
                    setModelState('valid');
                    setStatusContent([
                        "Model validated successfully!",
                        "You can now start training your model.",
                    ]);
                    console.log("Model validated successfully!");
                } else {
                    console.error("Output layer not found!");
                    setModelState('invalid');
                    setStatusContent([
                        "Output layer not found!",
                        "Please link an output layer to the right of the last object.",
                    ]);
                }
                break;
            } else {
                currentObject = currentObject.rightLink; // Move to the next object
            }
            chain.push(objectData);
            setChangeValidateModelBtnColor("defaultSandboxButton"); // change Validate Model button to green.
            setChangeStartTrainingBtnColor("greenSandboxButton"); //change Start Training button to green
        }

        model = chain;
        console.log("Chain of objects:", chain);
        
        //Might delete this in the future.
        //backend_worker.postMessage({ func: 'validateModel', args: { model } });
        
        createModel();
        
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
    function AddObject(objectType = "all", subType = null, datasetFileName = "none", active = true, location = null) {
        // Map layer types to their corresponding snap point configurations
        const snapTypeMap = {
            dataBatcher: "lr", // Data batcher can snap left and right
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

        if (!location) {
            // If no location is provided, generate a random one
            location = {
                x: 300 + (Math.random() * 100 - 50),
                y: 300 + (Math.random() * 100 - 50)
            };
        }

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
                    snapType,
                    active,
                    location,
                }
            ];
            //console.log("Updated list:", updatedList); // Debugging log
            return updatedList;
        });

        setCount(count + 1);
    };

    function RemoveObject(id) {
        console.log(list);
        console.log("Removing object with ID:", id);
        setList(prevList => {
            const updatedList = prevList.filter(item => item.id !== id);
            return updatedList;
        });
        console.log("Updated list after removal:", list); // Debugging log
    }


    // Recalculate position for all draggables
    // Required for bounds to function properly
    function UpdateDraggablePos() {
        draggables.forEach((thing) => {
            thing.position();
        });
    };

    const createLinkerLines = () => {
        if (stageRef.current) {
            stageRef.current.createLinkerLines();
        } else {
            console.error("Stage reference is not available!");
        }
    }
    
    const linkerChangeTest = () => {
        if (stageRef.current) {
            stageRef.current.linkerChangeTest();
        } else {
            console.error("Stage reference is not available!");
        }
    }

    return (
        <>
            {/* Fixed Top Bar */}
            <div className="topBar">
                <div style={{
                        width: "100%",
                        paddingRight: "20px",
                        display: "inline-flex",
                        justifyContent: "flex-start",
                        gap: "10px"
                    }}>
                    <Link to="/"><button className="defaultSandboxButton">Go Back</button></Link>
                    <button className="defaultSandboxButton" onClick={() => setOpenHelp(true)}>Need Help?</button>
                    {openHelp && (
                        <Overlay onClose={() => setOpenHelp(false)}>
                        <h2>About This Project</h2>
                        <p>AHH I NEED HELP!!! IF YOU CLOSE THIS DIV I WILL NO LONGER EXIST. NOOOOOOOOOOOOO DON'T CLICK IT!!! </p>
                        </Overlay>
                    )}
                </div>
                <div style={{
                    width: "100%",
                    paddingRight: "20px",
                    display: "inline-flex",
                    justifyContent: "flex-end",
                    gap: "10px"
                }}>
                    {/* =========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS========= */}
                    {/* <button className="defaultSandboxButton" onClick={() => savePretrainedSwitcher()}>(DevBtn) Save Pretrained</button> */}
                    {/* <button className="defaultSandboxButton" onClick={linkerChangeTest}>Mod LinkerLines</button> */}
                    {/* <button className="defaultSandboxButton" onClick={createLinkerLines}>Create LinkerLines</button> */}
                    {/* =========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS=========DEV BUTTONS========= */}

                    {trainingState === 'stopped' && (
                        <>
                            <button className={changeValidateModelBtnColor} onClick={() => validateModel(model)}>Validate Model</button>
                            <button className={changeStartTrainingModelBtnColor} onClick={() => startTraining(setTrainingState, setChangeStartTrainingBtnColor, setChangeStopTrainingBtnColor, setChangePauseTrainingBtnColor, modelState, setStatusContent, model, stageRef)}>Start Training</button>
                        </>
                    )}
                    {(trainingState === 'training' || trainingState === 'simulateTraining') && (
                        <>
                            <button className={changePauseTrainingModelBtnColor} onClick={() => pauseTraining(setTrainingState, setChangeResumeTrainingBtnColor, setStatusContent, stageRef)}>Pause Training</button>
                            <button className={changeStopTrainingModelBtnColor} onClick={() => stopTraining(setTrainingState, setChangeValidateModelBtnColor, setChangeStartTrainingBtnColor, setStatusContent, reportRef, stageRef)}>Stop Training</button>
                        </>
                    )}
                    {trainingState === 'paused' && (
                        <>
                            <button className={changeResumeTrainingModelBtnColor} onClick={() => resumeTraining(setTrainingState, setChangePauseTrainingBtnColor, stageRef)}>Resume Training</button>
                            <button className={changeStopTrainingModelBtnColor} onClick={() => stopTraining(setTrainingState, setChangeValidateModelBtnColor, setChangeStartTrainingBtnColor, setStatusContent, reportRef, stageRef)}>Stop Training</button>
                        </>
                    )}
                </div>
            </div>
    
            {/* Main Sandbox Area */}
            <div className="sandboxContainer">
                
                {/* Fixed NodeDrawer on the left */}
                <div className="nodeDrawerFixed">
                    <NodeDrawer
                        drawerOpen={drawerOpen}
                        setDrawerOpen={setDrawerOpen}
                        createNodeFunction={AddObject}
                    />
                </div>

                {/* Top Center Container */}
                <div className="topCenterContainer">
                    <Toolbar createNodeFunction={AddObject} elements={list}/>
                </div>

                {/* Fixed Top Right Status/Report */}
                <div className="topRightContainer">
                    {showStatusAndReport && (
                        <>
                            <Status title="Training Status" content={statusContent} />
                            <Report ref={reportRef} title="Training Report" />
                        </>
                    )}
                    {/* Toggle Button (can also be fixed if you want) */}
                    <button
                        className="toggleButton"
                        onClick={toggleStatusAndReport}
                    >
                        {showStatusAndReport ? "Hide Status & Report" : "Show Status & Report"}
                    </button>
                </div>
    
                
    
                {/* Scrollable Stage */}
                <div className="stageScrollWrapper" ref={scrollWrapperRef}>
                    <Stage
                        ref={stageRef}
                        elements={list}
                        drags={draggables}
                        setDrags={setDraggables}
                        updateDrags={UpdateDraggablePos}
                        AddObject={AddObject}
                        RemoveObject={RemoveObject}
                        drawerOpen={drawerOpen}
                        modelState={modelState}
                    />
                    {/* Fullscreen Button */}
                    <button
                        className="fullscreenButton"
                        onClick={handleFullscreen}
                        title="Toggle Fullscreen"
                    >
                        <img
                            src={isFullscreen ? fullscreenIn : fullscreenOut}
                            alt={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                            style={{ width: 32, height: 32, userSelect: `none` }}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}
export default Sandbox