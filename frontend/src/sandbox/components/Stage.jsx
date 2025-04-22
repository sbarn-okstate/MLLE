/* Sandbox.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney, Justin Moua
  *
  * PURPOSE: Stage for the sandbox nodes. Handles creation of sandbox nodes as
  *          well.
  * 
  * NOTES:
  */

import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState} from "react";
import {
    DataBatcher,
    DatasetNBC500Object,
    DatasetHeartPredictionObject,
    DatasetBostonHousingObject,
    DatasetMNISTObject,
    DatasetFashionMNISTObject,
    ActivationObject,
    NeuronObject,
    OutputLayerObject,
 } from './LayerObjects.jsx';
//import DataBatcher from './DataBatcher.jsx';
import PlainDraggable from "plain-draggable";
import LinkerLine from "linkerline";
import "./Stage.css";

//Stage is a component that handles the rendering and interaction of elements on a stage.
//Sandbox.jsx uses this component~
//elements is passed in as a prop from Sandbox.jsx
//and contains the following:
//  {
//      id: count,
//      objectType,
//      subType,
//      snapType
//  }
const Stage = forwardRef(({ elements, drags, setDrags, AddObject, RemoveObject, drawerOpen, modelState}, ref) => {
    const stageRef = useRef(null);
    const divRefs = useRef({});
    const handleRefs = useRef({});
    const drag = useRef({});
        /*
    {   activeObjects object structure
        id: 1, // Unique identifier
        element: div, // Reference to the DOM element
        leftLink: null, // Reference to the object snapped to the left
        rightLink: null, // Reference to the object snapped to the right
        snapPoints: [
            { type: "left", x: 100, y: 200 }, // Left snap point
            { type: "right", x: 300, y: 200 } // Right snap point
        ]
    }
    */
    const [activationHighlights, setActivationHighlights] = useState([]);
    const activeObjectsRef = useRef([]);
    const [activeObjectsState, setActiveObjectsState] = useState([]);

    const lineRefs = useRef([]);
    const [iter, setIter] = useState(0);
    const [updating, setUpdating] = useState(false);
    const [linesReady, setLinesReady] = useState(false);

    function LinkerChangeTest() {
        //console.log(`LINKER CHANGE!`);
        let i = 0;
        lineRefs.current.forEach(group => {
            console.log(i++);
            group.forEach(line => {

                let ss = `right`;
                let es = `left`;
                let sp = `behind`;
                let ep = `arrow1`;
                let color = `coral`;

                if(line.startSocket === `right`) {
                    ss = `left`;
                    es = `right`;
                }
    
                //console.log(line.endPlug);
                if(line.endPlug === `arrow1`) {
                    sp = `arrow1`;
                    ep = `behind`;
                }
    
                if(line.color === `coral`) {
                    color = `green`;
                }
    
                let end = line.end;
                let start = line.start;
                line.setOptions({start: end, end: start, startSocket: ss, endSocket: es, startPlug: sp, endPlug: ep, color: color});
            });
        });
    }

    // Creates LinkerLines for dense layers
    function CreateLinkerLines() {
        // Clear existing LinkerLines in lineRefs
        LinkerLine.removeAll();
        lineRefs.current = [];
    
        // Check if the model is valid
        if (modelState === `valid`) {
            const dataBatcher = activeObjectsRef.current.find(obj => obj.objectType === "dataBatcher");
    
            if (!dataBatcher) {
                console.error("LinkerLines: Data batcher not found!");
                return;
            }
    
            let prevObject = dataBatcher;
            let currentObject = dataBatcher.rightLink;
            let firstDense = true;
    
            while (currentObject && currentObject.rightLink != null) {
                // Create an array to store single group of lines
                let popArray = [];

                if (currentObject.objectType === 'neuron') {
                    if (firstDense) {
                        let currentLayerNode = currentObject;
                        while (currentLayerNode.topLink != null) {
                            currentLayerNode = currentLayerNode.topLink;
                        }
    
                        while (currentLayerNode != null) {
                            const newLine = new LinkerLine({
                                start: divRefs.current[prevObject.id],
                                end: handleRefs.current[currentLayerNode.id],
                                dash: {animation: true},
                                path: `straight`,
                                startSocket: `right`,
                                endSocket: `left`
                            });
                            newLine.name = `line${lineRefs.current.length}`;
                            newLine.hide(`none`);
    
                            popArray.push(newLine);
                            currentLayerNode = currentLayerNode.bottomLink;
                        }

                        // Store the group in the ref var
                        lineRefs.current.push(popArray);
    
                        firstDense = false;
                    }
    
                    let nextDenseLayer = currentObject;
                    let noLayer = true;
    
                    while (nextDenseLayer.rightLink != null && noLayer) {
                        if (nextDenseLayer.rightLink.objectType === "neuron") {
                            noLayer = false;
                        }
                        nextDenseLayer = nextDenseLayer.rightLink;
                    }
    
                    if (!noLayer) { // If there is another dense layer
                        let currentLayerNode = currentObject;
                        let currentNextLayerTopNode = nextDenseLayer;
    
                        while (currentLayerNode.topLink != null) {
                            currentLayerNode = currentLayerNode.topLink;
                        }
    
                        while (currentNextLayerTopNode.topLink != null) {
                            currentNextLayerTopNode = currentNextLayerTopNode.topLink;
                        }
    
                        let currentNextLayerNode = currentNextLayerTopNode;
    
                        popArray = []; // Clear the popArray
                        while (currentLayerNode != null) {
                            while (currentNextLayerNode != null) {
                                const newLine = new LinkerLine({
                                    start: handleRefs.current[currentLayerNode.id],
                                    end: handleRefs.current[currentNextLayerNode.id],
                                    dash: {animation: true},
                                    path: `fluent`,
                                    startSocket: `right`,
                                    endSocket: `left`
                                });
                                newLine.name = `line${lineRefs.current.length}`;
                                newLine.hide(`none`);
    
                                popArray.push(newLine);
                                currentNextLayerNode = currentNextLayerNode.bottomLink;
                            }
    
                            currentLayerNode = currentLayerNode.bottomLink;
                            currentNextLayerNode = currentNextLayerTopNode;
                        }

                        // Store the group in ref var
                        lineRefs.current.push(popArray);
                    } else { // No more dense layers means that we need to create lines to the end node
                        let currentLayerNode = currentObject;
                        while (currentLayerNode.topLink != null) {
                            currentLayerNode = currentLayerNode.topLink;
                        }
    
                        popArray = []; // Clear the pop array
                        while (currentLayerNode != null) {
                            const newLine = new LinkerLine({
                                start: handleRefs.current[currentLayerNode.id],
                                end: divRefs.current[nextDenseLayer.id],
                                dash: {animation: true},
                                path: `straight`,
                                startSocket: `right`,
                                endSocket: `left`
                            });
                            newLine.name = `line${lineRefs.current.length}`;
                            newLine.hide(`none`);
    
                            popArray.push(newLine);
                            currentLayerNode = currentLayerNode.bottomLink;
                        }

                        // Store the group in ref var
                        lineRefs.current.push(popArray);
                    }
                }
    
                prevObject = currentObject;
                currentObject = currentObject.rightLink;
            }

            // Reset iterator
            setIter(0);

            // Set lines as ready
            setLinesReady(true);
            setUpdating(true); // TEST - REMOVE ME; this should be called when we are training
        } else {
            console.log("LinkerLines: LinkerLines cannot be created as the model is not validated!");
        }
    }

    function RetractLinkerLines() {
        setUpdating(false);

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.hide(`draw`);
            });
        });
    }

    function StopAnimLinkerLines() {
        setUpdating(false);

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.setOptions({dash: `true`});
            });
        });
    }

    function StartAnimLinkerLines() {
        setUpdating(false);

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.setOptions({dash: {animation: true}});
            });
        });
    }

    // 2. Expose dataBatcher and activeObjects via the ref
    useImperativeHandle(ref, () => ({
        getStageElement: () => stageRef.current,
        getDataBatcher: () => activeObjectsRef.current.find(obj => obj.objectType === "dataBatcher"),
        getActiveObjects: () => activeObjectsRef.current,
        createLinkerLines: CreateLinkerLines,
        linkerChangeTest: LinkerChangeTest,
        startAnimLinkerLines: StartAnimLinkerLines,
        stopAnimLinkerLines: StopAnimLinkerLines,
        retractLinkerLines: RetractLinkerLines
    }));

    // draggables do not know about state variables? so the need an external helper
    function extAction(ref) {
        console.log(`an element has called for external action: ${typeof ref}`);
    }
    
    const iterRef = useRef(iter);

    useEffect(() => {
        iterRef.current = iter;
    }, [iter]);

    // Ticker for updating LinkerLines
    // Thickness of line: relative weight (log scale?)
    // Color of line: weight increase/decrease
    // Direction of dash: forward/back propagation
    useEffect(() => {
        const timerID = setInterval(() => {
            if(linesReady && updating) {
                if(iter < lineRefs.current.length) {
                    lineRefs.current[iterRef.current].forEach(line => {
                        line.show(`draw`);
                    });
                }

                setIter(i => {
                    console.log(`TICK: current iter: ${i}`);
                    return i + 1;
                });
            } else {
                // weight update stuff
            }
        }, 1000);
    
        return () => clearInterval(timerID);
    }, [linesReady, updating, lineRefs]);

    useEffect(() => {
        //console.log("elements", elements);
        //console.log("activeObjectsRef", activeObjectsRef.current);
        //console.log("activeObjectsState", activeObjectsState);

        // This useEffect runs after the components are rendered
        elements.forEach((item) => {
            const div = divRefs.current[item.id];
            const handle = handleRefs.current[item.id];
            if (!drag.current[item.id]) {
                drag.current[item.id] = 1;
                
                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});
                
                // Create a new PlainDraggable instance
                const draggable = new PlainDraggable(div);

                console.log("item", item);
                // Get the type of the object from the elements array
                const snapType = item?.snapType || "all"; // Default to "all" if type is not specified   
                const objectType = item?.objectType || `object${item.id}`;   
                const subType = item?.subType || `subtype${item.id}`; // Subtype isn't used for snapping rules currently
                const datasetFileName = item?.datasetFileName || `none`; // Dataset file name isn't used for snapping rules currently
                const active = item?.active
                const location = item?.location || {x: 200, y: 50}; // Default to (0, 0) if not specified
                const newObject = createNewObject(objectType, subType, datasetFileName, div, item.id, snapType, active);

                //console.log("Active Objects:", activeObjectsRef.current);

                // Define draggable behavior
                draggable.onMove = function () {
                    // Delete the linkerlines
                    RetractLinkerLines();
                    lineRefs.current = [];
                    setLinesReady(false);

                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjectsRef);

                    if (snap) {
                        const dx = snap.otherPoint.x - snap.currentPoint.x;
                        const dy = snap.otherPoint.y - snap.currentPoint.y;

                        // Move the draggable to the snap point
                        draggable.left += dx;
                        draggable.top += dy;

                        // Explicitly update the draggable's position
                        draggable.position();  
                    }

                    if (item.objectType === "activation") {
                        updateActivationHighlight(item.id);
                    }
                };

                draggable.onDragStart = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    clearLinks(currentObject);
                }
                
                draggable.onDragEnd = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjectsRef);
                    clearLinks(currentObject);

                    
                    const recycleBin = document.getElementById("recycle-bin");
                    const recycleRect = recycleBin.getBoundingClientRect();

                    // Check if mouse or object overlaps recycle bin
                    const mouseInBin = mouse &&
                    mouse.clientX >= recycleRect.left &&
                    mouse.clientX <= recycleRect.right &&
                    mouse.clientY >= recycleRect.top &&
                    mouse.clientY <= recycleRect.bottom;

                    if (mouseInBin) {
                        if (currentObject.objectType === "activation") {
                            setActivationHighlights(prev => prev.filter(h => h.id !== currentObject.id));
                        }
                        activeObjectsRef.current = activeObjectsRef.current.filter(obj => obj.id !== currentObject.id);
                        setActiveObjectsState([...activeObjectsRef.current]);
                        RemoveObject(currentObject.id);
                        return;
                    }

                    if (snap) {
                        findClosestSnapPoint(currentObject, activeObjectsRef, 5, true);
                        //console.log("Snapped:", currentObject, "to", snap.otherObject);
                    }

                    LinkerLine.positionAll(); // Logistically, this shouldn't be needed, so TEST!
                };
                // Set initial position
                draggable.top = location.y;
                draggable.left = location.x;

                // Visually above everything for dragging into node drawer for deletion
                draggable.onDrag = function () {
                    draggable.zIndex = 99000;
                }

                // Set the handle
                draggable.handle = handleRefs.current[item.id];

                // Do not override the cursor
                draggable.draggableCursor = false;
                draggable.draggingCursor = false;

                // Add the draggable to the drag list
                setDrags(prev => [...prev, draggable]);
            }
        });
    }, [elements, setDrags]);

    function updateLinks(currentObject, snap) {
        const updatedObjects = activeObjectsRef.current.map(obj => {
            if (obj === currentObject) {
                if (snap.currentPoint.type === "left") {
                    obj.leftLink = snap.otherObject;
                    snap.otherObject.rightLink = obj;
                } else if (snap.currentPoint.type === "right") {
                    obj.rightLink = snap.otherObject;
                    snap.otherObject.leftLink = obj;
                } else if (snap.currentPoint.type === "top") {
                    obj.topLink = snap.otherObject;
                    snap.otherObject.bottomLink = obj;

                    // Set left and right links to 0 when snapping to the top
                    if (!obj.leftLink && !obj.rightLink) {
                        obj.leftLink = 0;
                        obj.rightLink = 0;
                    }
                } else if (snap.currentPoint.type === "bottom") {
                    obj.bottomLink = snap.otherObject;
                    snap.otherObject.topLink = obj;

                    // Set left and right links to 0 when snapping to the bottom
                    if (!obj.leftLink && !obj.rightLink) {
                        obj.leftLink = 0;
                        obj.rightLink = 0;
                    }
                }
            }
            return obj;
        });
    
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
    }

    function clearLinks(currentObject) {
        const updatedObjects = activeObjectsRef.current.map(obj => {
            if (obj === currentObject) {
                if (obj.leftLink) obj.leftLink.rightLink = null;
                if (obj.rightLink) obj.rightLink.leftLink = null;
                if (obj.topLink) obj.topLink.bottomLink = null;
                if (obj.bottomLink) obj.bottomLink.topLink = null;

                obj.leftLink = null;
                obj.rightLink = null;
                obj.topLink = null;
                obj.bottomLink = null;
            }
            return obj;
        });
    
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
    }
    // custom snapping behavior
    function findClosestSnapPoint(currentObject, activeObjectsRef, minDistance = 50, linkIfValid = false) {
        if (!currentObject || !currentObject.element) {
            console.error("findClosestSnapPoint: currentObject or its element is undefined.");
            return null;
        }
    
        if (!currentObject.snapPoints) {
            console.error("findClosestSnapPoint: snapPoints is undefined for currentObject:", currentObject);
            return null;
        }
    
        // Cache the current object's bounding rect
        const currentRect = currentObject.element.getBoundingClientRect();
    
        // Dynamically calculate the current snap points
        const currentSnapPoints = currentObject.snapPoints
            .filter(point => {
                // Only consider snap points with null links
                return (point.type === "left" && !currentObject.leftLink) ||
                   (point.type === "right" && !currentObject.rightLink) ||
                   (point.type === "top" && !currentObject.topLink) ||
                   (point.type === "bottom" && !currentObject.bottomLink);
            })
            .map(point => ({
                type: point.type,
                x: point.type === "left" ? currentRect.left :
                   point.type === "right" ? currentRect.right :
                   currentRect.left + currentRect.width / 2, // For top and bottom, x is centered
                y: point.type === "top" ? currentRect.top :
                   point.type === "bottom" ? currentRect.bottom :
                   currentRect.top + currentRect.height / 2, // For left and right, y is centered
            }));
    
        let pairs = []; //
    
        activeObjectsRef.current.forEach(otherObject => {
            if (otherObject === currentObject) return; // Skip the same object
            if (!otherObject.isActive) return; // Skip inactive objects
            // Cache the other object's bounding rect
            const otherRect = otherObject.element.getBoundingClientRect();
    
            // Dynamically calculate the other object's snap points
            const otherSnapPoints = otherObject.snapPoints
            .filter(point => {
                // Only consider snap points with null links
                return (point.type === "left" && otherObject.leftLink == null) ||
                    (point.type === "right" && otherObject.rightLink == null) ||
                    (point.type === "top" && otherObject.topLink == null) ||
                    (point.type === "bottom" && otherObject.bottomLink == null);
            })
            .map(point => ({
                type: point.type,
                x: point.type === "left" ? otherRect.left :
                    point.type === "right" ? otherRect.right :
                    otherRect.left + otherRect.width / 2, // For top and bottom, x is centered
                y: point.type === "top" ? otherRect.top :
                    point.type === "bottom" ? otherRect.bottom :
                    otherRect.top + otherRect.height / 2, // For left and right, y is centered
            }));
    
            // Compare current snap points with other snap points
            currentSnapPoints.forEach(currentPoint => {
                otherSnapPoints.forEach(otherPoint => {
                    // Ensure valid snap points (left-to-right, right-to-left, top-to-bottom, bottom-to-top)
                    const isValidSnap =
                        (currentPoint.type === "left" && otherPoint.type === "right") ||
                        (currentPoint.type === "right" && otherPoint.type === "left") ||
                        (currentPoint.type === "top" && otherPoint.type === "bottom") ||
                        (currentPoint.type === "bottom" && otherPoint.type === "top");

                    if (isValidSnap) {
                        const distance = Math.hypot(currentPoint.x - otherPoint.x, currentPoint.y - otherPoint.y);
                        if (distance < minDistance) {
                            pairs.push({
                                currentPoint,
                                otherPoint,
                                currentObject,
                                otherObject,
                                distance,
                                priority: (
                                    (currentPoint.type === "left" && otherPoint.type === "right") ||
                                    (currentPoint.type === "right" && otherPoint.type === "left")
                                ) ? 1 : 2 // 1 = left/right, 2 = top/bottom
                            });
                        }
                    }
                });
            });
        });
        // Sort pairs: left/right first, then top/bottom, then by distance
        pairs.sort((a, b) => a.priority - b.priority || a.distance - b.distance);

        if (linkIfValid) {
            // Link all left/right pairs first, then top/bottom
            pairs.forEach(pair => {
                if (pair.priority === 1) {
                    updateLinks(pair.currentObject, pair);
                }
            });
            pairs.forEach(pair => {
                if (pair.priority === 2) {
                    updateLinks(pair.currentObject, pair);
                }
            });
            // No need to return a closest point in this mode
            return null;
        } else {
            // Return the closest pair (prioritizing left/right)
            return pairs.length > 0 ? pairs[0] : null;
        }
    }

    function createNewObject(objectType, subType, datasetFileName, div, index, snapType = "all", active = true) {
        const snapPoints = [];
    
        // Add snap points based on the shorthand type
        if (snapType === "all") {
            snapPoints.push({ type: "left" });
            snapPoints.push({ type: "right" });
            snapPoints.push({ type: "top" });
            snapPoints.push({ type: "bottom" });
        } else {
            if (snapType.includes("l")) snapPoints.push({ type: "left" });
            if (snapType.includes("r")) snapPoints.push({ type: "right" });
            if (snapType.includes("t")) snapPoints.push({ type: "top" });
            if (snapType.includes("b")) snapPoints.push({ type: "bottom" });
        }
    
        const newObject = {
            id: index,
            objectType: objectType,
            subType: subType,
            datasetFileName: datasetFileName,
            element: div,
            leftLink: null,
            rightLink: null,
            topLink: null,
            bottomLink: null,
            snapPoints,
            isSnapped: false,
            isActive: active
        };
    
        const updatedObjects = [...activeObjectsRef.current, newObject];
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
        return newObject;
    }

    function updateActivationHighlight(id) {
        const el = divRefs.current[id];
        if (el) {
            const rect = el.getBoundingClientRect();
            const stageRect = stageRef.current.getBoundingClientRect();
            setActivationHighlights(prev => {
                // Remove old entry for this id, add new one
                const filtered = prev.filter(h => h.id !== id);
                return [...filtered, { id, left: rect.left - stageRect.left, width: rect.width }];
            });
        }
    }

    function renderObject(objectType, subType, datasetFileName, props) {
        const { key, ...restProps } = props; // Extract the key from props
        const currentObject = activeObjectsState.find(obj => obj.id === key);

        // Dynamically construct activeLinks based on snapPoints
        const linkStates = currentObject
            ? currentObject.snapPoints.reduce((links, point) => {
                const linkType = point.type; // e.g., "top", "right", "bottom", "left"
                const linkValue = currentObject[`${linkType}Link`]; // Access the corresponding link property

                // Only include links that are in snapPoints
                links[linkType] = linkValue !== null && linkValue !== 0 ? true : linkValue;
                return links;
            }, {})
            : {}; // Default to an empty object if no currentObject

        switch (objectType) {
            case "dataBatcher":
                return <DataBatcher key={key} {...restProps} displayText="" linkStates={linkStates}/>;
            case "dataset":
                switch (subType) {
                    case ".csv":
                        switch (datasetFileName) {
                            case "synthetic_normal_binary_classification_500.csv":
                                return <DatasetNBC500Object key={key} {...restProps} linkStates={linkStates}/>;
                            case "heart.csv":
                                return <DatasetHeartPredictionObject key={key} {...restProps} linkStates={linkStates} />;
                            case "boston-housing-train.csv":
                                return <DatasetBostonHousingObject key={key} {...restProps} linkStates={linkStates} />;
                            case "mnist_train.csv":
                                return <DatasetMNISTObject key={key} {...restProps} linkStates={linkStates} />;
                            case "fashion-mnist_train.csv":
                                return <DatasetFashionMNISTObject key={key} {...restProps} linkStates={linkStates} />;
                        }
                }
            case "activation":
                return <ActivationObject key={key} {...restProps} linkStates={linkStates}/>;
            case "output":
                return <OutputLayerObject key={key} {...restProps} linkStates={linkStates}/>;
            case "neuron":
                return <NeuronObject key={key} {...restProps} linkStates={linkStates} />;
            default:
                return null;
        }
    }

    return (
        <div id="stage" className="stage" ref={stageRef}>
            {activationHighlights.map(({ id, left, width }) => {
                // Find the corresponding activation object in state
                const activationObj = activeObjectsState.find(obj => obj.id === id);
                // Only show the highlight if the activation object exists and has at least one active link
                const hasActiveLink = activationObj &&
                    (activationObj.leftLink || activationObj.rightLink || activationObj.topLink || activationObj.bottomLink);

                if (!hasActiveLink) return null;

                return (
                    <React.Fragment key={`${id}-highlight`}>
                    <div
                        key={`${id}-a-left`}
                        id={`${id}-a-left`}
                        className="activation-extension-left"
                        style={{ left: left + width / 4, width: width / 4 }}
                    />
                    <div
                        key={`${id}-a-right`}
                        id={`${id}-a-right`}
                        className="activation-extension-right"
                        style={{ left: left + width / 2, width: width / 4 }}
                    />
                </React.Fragment>
                );
            })}
            {elements.map((item) => (
                renderObject(item.objectType, item.subType, item.datasetFileName, {
                    key: item.id,
                    name: item.id,
                    ref: (el) => { 
                        if (el) {
                            divRefs.current[item.id] = el;
                        } else {
                            delete divRefs.current[item.id];
                        }
                    },
                    handleRef: (el) => {
                        if (el) {
                            handleRefs.current[item.id] = el;
                        } else {
                            delete handleRefs.current[item.id];
                        }
                    },
                    action: extAction
                })
            ))}
            <div id="recycle-bin" className="recycle-bin">
                🗑️
            </div>
        </div>
    );
});

export default Stage;
