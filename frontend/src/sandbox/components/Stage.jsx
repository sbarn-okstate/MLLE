/* SandboxTest.jsx
  *
  * AUTHOR(S): Mark Taylor, Samuel Barney
  *
  * PURPOSE: Stage for the sandbox nodes. Handles creation of sandbox nodes as
  *          well.
  * 
  * NOTES: We need to look into better snapping mechanics
  */

import { useEffect, useRef } from "react";
import {
    DatasetObject,
    DenseLayerObject,
    ActivationLayerObject,
    ConvolutionLayerObject,
    OutputLayerObject
 } from './LayerObjects.jsx';

import PlainDraggable from "plain-draggable";


export default function Stage({elements, drags, setDrags, drawerOpen}) {
    const divRefs = useRef([]);
    const handleRefs = useRef([]);
    const drag = useRef([]);
    const activeObjects = useRef([]);
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

    // draggables do not know about state variables? so the need an external helper
    function extAction(ref) {
        console.log(`an element has called for external action: ${typeof ref}`);
    }

    useEffect(() => {
        console.log("divRefs:", divRefs.current);
        console.log("handleRefs:", handleRefs.current);

        // This useEffect runs after the components are rendered
        divRefs.current.forEach((div, index) => {
            if (!drag.current[index]) {
                drag.current[index] = 1;

                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});
                
                // Get the type of the object from the elements array
                const type = elements[index]?.snapType || "all"; // Default to "all" if type is not specified

                // Create a new PlainDraggable instance
                const draggable = new PlainDraggable(div);

                const newObject = createNewObject(div, index, type);
                activeObjects.current.push(newObject);

                

                // Define draggable behavior
                draggable.onMove = function () {
                    const currentObject = activeObjects.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjects);

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
                    const currentObject = activeObjects.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjects);

                    if (snap) {
                        // Finalize the links
                        if (snap.currentPoint.type === "left") {
                            currentObject.leftLink = snap.otherObject;
                            snap.otherObject.rightLink = currentObject;
                        } else if (snap.currentPoint.type === "right") {
                            currentObject.rightLink = snap.otherObject;
                            snap.otherObject.leftLink = currentObject;
                        } else if (snap.currentPoint.type === "top") {
                            currentObject.topLink = snap.otherObject;
                            snap.otherObject.bottomLink = currentObject;
                        } else if (snap.currentPoint.type === "bottom") {
                            currentObject.bottomLink = snap.otherObject;
                            snap.otherObject.topLink = currentObject;
                        }

                        console.log("Snapped:", currentObject, "to", snap.otherObject);
                    } else {
                        // Clear links if no snap occurred
                        if (currentObject.leftLink) {
                            currentObject.leftLink.rightLink = null;
                            currentObject.leftLink = null;
                        }
                        if (currentObject.rightLink) {
                            currentObject.rightLink.leftLink = null;
                            currentObject.rightLink = null;
                        }
                        if (currentObject.topLink) {
                            currentObject.topLink.bottomLink = null;
                            currentObject.topLink = null;
                        }
                        if (currentObject.bottomLink) {
                            currentObject.bottomLink.topLink = null;
                            currentObject.bottomLink = null;
                        }

                        console.log("Unsnapped:", currentObject);
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

    // custom snapping behavior
    function findClosestSnapPoint(currentObject, activeObjects) {
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
    
        activeObjects.current.forEach(otherObject => {
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

    function createNewObject(div, index, type = "all") {
        const snapPoints = [];
    
        // Add snap points based on the shorthand type
        if (type === "all") {
            snapPoints.push({ type: "left" });
            snapPoints.push({ type: "right" });
            snapPoints.push({ type: "top" });
            snapPoints.push({ type: "bottom" });
        }
        else {
            if (type.includes("l")) {
                snapPoints.push({ type: "left" });
            }
            if (type.includes("r")) {
                snapPoints.push({ type: "right" });
            }
            if (type.includes("t")) {
                snapPoints.push({ type: "top" });
            }
            if (type.includes("b")) {
                snapPoints.push({ type: "bottom" });
            }
        }
    
        return {
            id: `object${index}`,
            element: div,
            leftLink: null,
            rightLink: null,
            topLink: null,
            bottomLink: null,
            snapPoints,
        };
    }

    function renderObject(type, props) {
        const { key, ...restProps } = props; // Extract the key from props
        //React requires the key prop to be passed directly to the JSX element, not as part of a spread object (...props).
        //This is because React uses the key prop internally to identify elements in a list, and it cannot extract it from a spread object.
        console.log("Rendering object:", type);
        switch (type) {
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
            default:
                return null;
        }
    }

    return (
        <div id="stage" className="teststage">
            {elements.map((item, index) => (
                renderObject(item.type, {
                    key: item.name,
                    name: item.name,
                    ref: el => (divRefs.current[index] = el),
                    handleRef: el => (handleRefs.current[index] = el),
                    action: extAction
                })
            ))}
        </div>
    );
}
