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
    DatasetObject,
    ActivationObject,
    NeuronObject,
    OutputLayerObject,
 } from './LayerObjects.jsx';
//import DataBatcher from './DataBatcher.jsx';
import PlainDraggable from "plain-draggable";
import LinkerLine from "linkerline";
import {getWeightsAndMetrics} from '../../backend/backend.js';
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
const Stage = forwardRef(({ elements, drags, setDrags, AddObject, RemoveObject, drawerOpen, modelState, backend }, ref) => {
    const delay = 1;
    const stageRef = useRef(null);
    const divRefs = useRef({});
    const handleRefs = useRef({});
    const drag = useRef({});

    const [size, setSize] = useState(0);
    const iter = useRef(0);
    const [dir, setDir] = useState(true);
    const isFirstDone = useRef(false);
    const end = useRef(false);
    const isUpdating = useRef(false);
    const [linesReady, setLinesReady] = useState(false);
    const [weights, setWeights] = useState({});
    const [delayTick, setDelayTick] = useState(0);
    const [workaround, setWorkaround] = useState(true);
    const [dataBatcherInfo, setDataBatcherInfo] = useState("test");
    const [outputInfo, setOutputInfo] = useState("test");
    // Will be array of arrays. index 0: current, index 1: prev, index 2: color (based on current and prev comparison)
    const [lineWeights, setLineWeights] = useState([]);

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

    // Could still use this function later
    // It should be renamed first
    function LinkerChangeTest() {
        if(true) {
            isUpdating.current = true;
            setLinesReady(true);
        } else {
        //console.log(`LINKER CHANGE!`);
        let i = 0;
        lineRefs.current.forEach(group => {
            //console.log(i++);
            group.forEach(line => {

                let ss = `right`;
                let es = `left`;
                let color = `coral`;

                if(line.startSocket === `right`) {
                    ss = `left`;
                    es = `right`;
                }
    
                if(line.color === `coral`) {
                    color = `green`;
                }
    
                let end = line.end;
                let start = line.start;
                line.setOptions({startPlug: `behind`, endPlug: `behind`});
                line.setOptions({start: end, end: start, startSocket: ss, endSocket: es, color: color});
            });
        });}
    }

    // Creates LinkerLines for dense layers
    function CreateLinkerLines() {
        console.log("LinkerLines: Creating LinkerLines...");
        // Clear existing LinkerLines in lineRefs
        LinkerLine.removeAll();
        lineRefs.current = [];
        // Reset all effect stuff
        iter.current = 0;
        end.current = false;
        isFirstDone.current = false;
        setDelayTick(0);
        setWorkaround(true);
        setDir(true);

        // get how many groups of lines are created
        let lc = 0;
        
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
            let buildingLineWeights = [];
            let count = 0;
    
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
                                dash: {animation: {duration: 500, timing: 'linear'}},
                                path: `straight`,
                                startSocket: `right`,
                                endSocket: `left`,
                                startPlug: `behind`,
                                endPlug: `behind`
                            });
                            buildingLineWeights.push([0,0,`coral`]);
                            newLine.name = `line${count}`;
                            newLine.iId = count;
                            count += 1;
                            newLine.hide(`none`);
    
                            popArray.push(newLine);
                            currentLayerNode = currentLayerNode.bottomLink;
                        }

                        // Store the group in the ref var
                        lineRefs.current.push(popArray);
                        lc += 1;
    
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
                                    dash: {animation: {duration: 500, timing: 'linear'}},
                                    path: `fluent`,
                                    startSocket: `right`,
                                    endSocket: `left`,
                                    startPlug: `behind`,
                                    endPlug: `behind`
                                });
                                buildingLineWeights.push([0,0,`coral`]);
                                newLine.name = `line${count}`;
                                newLine.iId = count;
                                count += 1;
                                newLine.hide(`none`);
    
                                popArray.push(newLine);

                                currentNextLayerNode = currentNextLayerNode.bottomLink;
                            }
    
                            currentLayerNode = currentLayerNode.bottomLink;
                            currentNextLayerNode = currentNextLayerTopNode;
                        }

                        // Store the group in ref var
                        lineRefs.current.push(popArray);
                        lc += 1;
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
                                dash: {animation: {duration: 500, timing: 'linear'}},
                                path: `straight`,
                                startSocket: `right`,
                                endSocket: `left`,
                                startPlug: `behind`,
                                endPlug: `behind`
                            });
                            buildingLineWeights.push([0,0,`coral`]);
                            newLine.name = `line${count}`;
                            newLine.iId = count;
                            count += 1;
                            newLine.hide(`none`);
    
                            popArray.push(newLine);

                            currentLayerNode = currentLayerNode.bottomLink;
                        }

                        // Store the group in ref var
                        lineRefs.current.push(popArray);
                        lc += 1;
                    }
                }
    
                prevObject = currentObject;
                currentObject = currentObject.rightLink;
            }

            console.log(`LinkerLines: Created ${count} lines`);

            setLineWeights(buildingLineWeights);

            // Set size of the array
            setSize(lc);

            // Reset iterator
            iter.current = 0;

            // Set lines as ready
            setLinesReady(true);
            isUpdating.current = true; // TEST - REMOVE ME; this should be called when we are training
        } else {
            console.log("LinkerLines: LinkerLines cannot be created as the model is not validated!");
        }
    }

    function RetractLinkerLines() {
        isUpdating.current = false;
        isFirstDone.current = false;
        end.current = false;
        iter.current = 0;

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.hide(`draw`);
            });
        });
    }

    function StopAnimLinkerLines() {
        isUpdating.current = false;

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.setOptions({dash: `true`});
            });
        });
    }

    function StartAnimLinkerLines() {
        isUpdating.current = false;

        lineRefs.current.forEach(group => {
            group.forEach(line => {
                line.setOptions({dash: {animation: {duration: 500, timing: 'linear'}}});
            });
        });
    }

    function updateLineWeights() {
        // index of group
        let gIndex = 0;
        // index of line
        let lIndex = 0;
        // index of current line
        let clIndex = 0;
        // make copy of lineWeights
        let tmp = lineWeights;

        lineRefs.current.forEach(group => {
            // increment through lines
            group.forEach(line => {
                // Set the prev to current
                tmp[lIndex][1] = tmp[lIndex][0];

                // Set the current to actual current
                console.log(`CRAP: gIndex: ${gIndex}, size at gIndex: ${group.length}, clIndex: ${clIndex}, total: ${group.length - 1 + clIndex}`);
                tmp[lIndex][0] = weights.weights[gIndex + 1][group.length - 1 + clIndex];

                // set the color
                console.log(`comparing ${tmp[lIndex][0]} and ${tmp[lIndex][1]}`);
                if (tmp[lIndex][0] > tmp[lIndex][1]) {
                    tmp[lIndex][2] = `green`;
                } else if(tmp[lIndex][0] < tmp[lIndex][1]) {
                    tmp[lIndex][2] = `red`;
                } else {
                    tmp[lIndex][2] = `coral`;
                }

                // increment index
                clIndex += 1;
                lIndex += 1;
            });


            // increment index
            gIndex += 1;
            clIndex = 0; // reset local line index
        });

        setLineWeights(tmp);
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

    // NEEDS TO FREEZE AFTER A FULL GO
    // FREEZE ANIMATION AS WELL
    // This is where the LinkerLines are updated
    useEffect(() => {
        const timerID = setInterval(() => {
            if (isUpdating.current && linesReady) {
                let newIter = dir ? iter.current + 1 : iter.current - 1;
                
                // Line manipulation
                if (!isFirstDone.current) {
                    // First pass: Draw the lines
                    lineRefs.current[iter.current].forEach((line) => {
                        line.show(`draw`);
                    });
                } else {
                    // Subsequent passes: Manipulate the lines (if needed)
                    if(delayTick == 0) {
                        
                        if(workaround) {
                            // skip
                            setWorkaround(false);
                        } else {
                            // We only manipulate the lines if delayTick is not active
                            lineRefs.current[iter.current].forEach((line) => {
                                let ss = `right`;
                                let es = `left`;
                                // let color = `coral`;
        
                                // Socket sets the side the lines link to
                                if (line.startSocket === `right`) {
                                    ss = `left`;
                                    es = `right`;
                                }

                                // // Calculate a color from weight changes (pos/neg)
                                // if (line.color === `coral`) {
                                //     color = `green`;
                                // }

                                // if(lineWeights[line.iId][0] > lineWeights[line.iId][1]) {
                                //     color = `blue`;
                                // }
                                // else if(lineWeights[line.iId][0] < lineWeights[line.iId][1]) {
                                //     color = `red`;
                                // } else {
                                //     console.log(`same`);
                                //     color = `pink`;
                                // }
                                //console.log(`line: ${line.iId}`);

                                // TODO - determine line thickness from weight value
        
                                let end = line.end;
                                let start = line.start;
                                line.setOptions({ start: end, end: start, startSocket: ss, endSocket: es, color: lineWeights[line.iId][2], dash: {animation: {duration: 500, timing: 'linear'}} });
                            });
                        }
                    }
                }

                // Animation junk
                // Check if we need to reverse direction
                if (!end.current) {
                    iter.current = newIter;

                    if (isFirstDone.current) {
                        if (newIter === size - 1 || newIter === 0) {
                            setDir((prevDir) => !prevDir);
                            end.current = true; // Set end to true to start lingering
                        }
                    } else {
                        if (newIter === size) {
                            isFirstDone.current = true;
                            setDir((prevDir) => !prevDir);
                            end.current = true; // Set end to true to start lingering
                            iter.current = newIter - 1 // This needs to be here so that we don't index out of bounds later
                        }
                    }
                } else {
                    // Linger for one tick, then toggle end back to false
                    if (delayTick <= delay) {
                        const newDelayTick = delayTick + 1;
                        //console.log(`DELAYING FOR THIS TICK!`);

                        if(delayTick === 0) {
                            // FOR SAM: Weights and metrics are updated here
                            // It may not be updated instant, so there is a console.log statement below that shows when the update should be done
                            setWeights(getWeightsAndMetrics());
                        }

                        if(delayTick > 0) {
                            // Set the animation for all lines to none
                            //console.log(`STOPPING ANIMATION`);
                            lineRefs.current.forEach(group => {
                                group.forEach(line => {
                                    line.setOptions({dash: true}); // Stop animating line
                                });
                            });

                            console.log(weights.weights[1][0]); // HERE
                            updateLineWeights();
                            
                            if (dir) {
                                setDataBatcherInfo(performance.now());
                                setOutputInfo("");
                            } else {
                                setOutputInfo(performance.now());
                                setDataBatcherInfo("");
                            }
                            
                        }   

                        setDelayTick(newDelayTick);
                    } else {
                        end.current = false;
                        setDelayTick(0);
                    }
                }
            }
        }, 1000); // Update once a second

        return () => {
            clearInterval(timerID);
        };
    }, [linesReady, iter, dir, end, size, weights, delayTick, workaround]);

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
                return <DataBatcher key={key} {...restProps} displayText={dataBatcherInfo} linkStates={linkStates}/>;
            case "dataset":
                return <DatasetObject key={key} {...restProps} fileName={datasetFileName} linkStates={linkStates} />;
            case "activation":
                return <ActivationObject key={key} {...restProps} linkStates={linkStates}/>;
            case "output":
                return <OutputLayerObject key={key} {...restProps} explanation={outputInfo} linkStates={linkStates}/>;
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
                    }
                })
            ))}
            <div id="recycle-bin" className="recycle-bin">
                🗑️
            </div>
        </div>
    );
});

export default Stage;
