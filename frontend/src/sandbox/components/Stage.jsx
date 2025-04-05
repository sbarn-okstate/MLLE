/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney
  *
  * PURPOSE: Stage for the sandbox nodes. Handles creation of sandbox nodes as
  *          well.
  * 
  * NOTES: We need to look into better snapping mechanics
  * FIXME: activeObjects isn't the same across objects
  */

import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState} from "react";
import {
    DatasetObject,
    DenseLayerObject,
    ActivationLayerObject,
    ConvolutionLayerObject,
    NeuronObject,
    OutputLayerObject
 } from './LayerObjects.jsx';
import StartNode from './StartNode.jsx';
import PlainDraggable from "plain-draggable";
import snapPoints from "../snapPoints.js";


const Stage = forwardRef(({ elements, drags, setDrags, drawerOpen }, ref) => {
    const divRefs = useRef([]);
    const handleRefs = useRef([]);
    const drag = useRef([]);

    /*
    {   activeObjects object structure
        id: "object1", // Unique identifier
        element: div, // Reference to the DOM element
        leftLink: null, // Reference to the object snapped to the left
        rightLink: null, // Reference to the object snapped to the right
        snapPoints: [
            { type: "left", x: 100, y: 200 }, // Left snap point
            { type: "right", x: 300, y: 200 } // Right snap point
        ]
    }
    */

    const activeObjectsRef = useRef([]);
    const [activeObjectsState, setActiveObjectsState] = useState([]);


    // 2. Expose startNode and activeObjects via the ref
    useImperativeHandle(ref, () => ({
        getStartNode: () => activeObjectsRef.current.find(obj => obj.id === "startNode"),
        getActiveObjects: () => activeObjectsRef.current,
    }));

    // draggables do not know about state variables? so the need an external helper
    function extAction(ref) {
        console.log(`an element has called for external action: ${typeof ref}`);
    }
    
    useEffect(() => {
        //console.log("divRefs:", divRefs.current);
        //console.log("handleRefs:", handleRefs.current);

        // This useEffect runs after the components are rendered
        divRefs.current.forEach((div, index) => {
            if (!drag.current[index]) {
                drag.current[index] = 1;

                if (index === 0) {
                    // Skip the first element (StartNode)
                    return;
                }

                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});
                
                // Create a new PlainDraggable instance
                const draggable = new PlainDraggable(div);

                console.log("elements:", elements);
                console.log("div:", div);
                console.log("index:", index-1);
                // Get the type of the object from the elements array
                const snapType = elements[index-1]?.snapType || "all"; // Default to "all" if type is not specified   
                const objectType = elements[index-1]?.objectType || `object${index}`;   
                const newObject = createNewObject(objectType, div, index, snapType);
                console.log("Active Objects:", activeObjectsRef.current);
                // Define draggable behavior
                draggable.onMove = function () {
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
                };

                draggable.onDragEnd = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjectsRef);

                    if (snap) {
                        updateLinks(currentObject, snap);
                        //console.log("Snapped:", currentObject, "to", snap.otherObject);
                    } else {
                        clearLinks(currentObject);
                        //console.log("Unsnapped:", currentObject);
                    }

                    if (mouse.x < 250) {
                        // somehow remove this
                        console.error(`TODO: Implement despawning div!`);
                        
                        //extAction(divRefs[index]);
                    }

                };

                // Set initial position
                draggable.top = 300;
                draggable.left = 300;

                // Visually above everything for dragging into node drawer for deletion
                draggable.onDrag = function () {
                    draggable.zIndex = 99000;
                }

                // Set the handle
                draggable.handle = handleRefs.current[index];

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
                } else if (snap.currentPoint.type === "bottom") {
                    obj.bottomLink = snap.otherObject;
                    snap.otherObject.topLink = obj;
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
                if (obj.leftLink) {
                    obj.leftLink.rightLink = null;
                    obj.leftLink = null;
                }
                if (obj.rightLink) {
                    obj.rightLink.leftLink = null;
                    obj.rightLink = null;
                }
                if (obj.topLink) {
                    obj.topLink.bottomLink = null;
                    obj.topLink = null;
                }
                if (obj.bottomLink) {
                    obj.bottomLink.topLink = null;
                    obj.bottomLink = null;
                }
            }
            return obj;
        });
    
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
    }
    // custom snapping behavior
    function findClosestSnapPoint(currentObject, activeObjectsRef) {
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
    
        let closestPoint = null;
        let minDistance = 50; // Max snap distance
    
        activeObjectsRef.current.forEach(otherObject => {
            if (otherObject === currentObject) return; // Skip the same object
    
            // Cache the other object's bounding rect
            const otherRect = otherObject.element.getBoundingClientRect();
    
            // Dynamically calculate the other object's snap points
            const otherSnapPoints = otherObject.snapPoints
            .filter(point => {
                // Only consider snap points with null links
                return (point.type === "left" && !otherObject.leftLink) ||
                    (point.type === "right" && !otherObject.rightLink) ||
                    (point.type === "top" && !otherObject.topLink) ||
                    (point.type === "bottom" && !otherObject.bottomLink);
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
                            minDistance = distance;
                            closestPoint = { currentPoint, otherPoint, currentObject, otherObject };
                        }
                    }
                });
            });
        });
    
        return closestPoint;
    }

    function createNewObject(objectType, div, index, snapType = "all") {
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
            element: div,
            leftLink: null,
            rightLink: null,
            topLink: null,
            bottomLink: null,
            snapPoints,
        };
    
        const updatedObjects = [...activeObjectsRef.current, newObject];
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
        return newObject;
    }

    // Add the startNode to activeObjects during rendering
    const initializeStartNode = (element) => {
        if (!element) {
            console.warn("initializeStartNode called with null element.");
            return; // Ensure the element is valid
        }
    
        const existingStartNode = activeObjectsRef.current.find(obj => obj.id === "startNode");
        if (existingStartNode) {
            console.warn("startNode already exists in activeObjects.");
            return;
        }
    
        console.log("Initializing startNode...");
        const startNode = {
            id: "startNode",
            objectType: "startNode",
            element: element, // Assign the DOM element for the StartNode
            leftLink: null,
            rightLink: null,
            topLink: null,
            bottomLink: null,
            snapPoints: [{ type: "right" }, { type: "left" }]
        };
    
        const updatedObjects = [...activeObjectsRef.current, startNode];
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
    };

    function renderObject(objectType, props) {
        const { key, ...restProps } = props; // Extract the key from props
        const currentObject = activeObjectsState.find(obj => obj.id === props.name);

        const activeLinks = currentObject
            ? {
                top: !!currentObject.topLink,
                right: !!currentObject.rightLink,
                bottom: !!currentObject.bottomLink,
                left: !!currentObject.leftLink,
            }
            : { top: false, right: false, bottom: false, left: false };

        switch (objectType) {
            case "dataset":
                return <DatasetObject key={key} {...restProps} />;
            case "dense":
                return <DenseLayerObject key={key} {...restProps} />;
            case "activation":
                return <ActivationLayerObject key={key} {...restProps} />;
            case "convolution":
                return <ConvolutionLayerObject key={key} {...restProps} />;
            case "output":
                return <OutputLayerObject key={key} {...restProps} />;
            case "neuron":
                return <NeuronObject key={key} {...restProps} activeLinks={activeLinks} />;
            default:
                return null;
        }
    }

    return (
        <div id="stage" className="teststage">
            <StartNode
                ref={(el) => {
                    divRefs.current[0] = el;
                    initializeStartNode(el); // Initialize the startNode during rendering
                }}
                handleRef={(el) => (handleRefs.current[0] = el)}
                name={"startNode"}
            />
            {elements.map((item, index) => (
                renderObject(item.objectType, {
                    key: index+1,
                    name: item.id,
                    ref: (el) => (divRefs.current[index + 1] = el),
                    handleRef: (el) => (handleRefs.current[index + 1] = el),
                    action: extAction
                })
            ))}
        </div>
    );
});

export default Stage;
