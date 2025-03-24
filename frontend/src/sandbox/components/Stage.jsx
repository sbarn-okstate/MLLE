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
import TestDiv from './TestDiv.jsx';
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
        // This useEffect runs after the components are rendered
        divRefs.current.forEach((div, index) => {
            // We need to make sure that we do not recreate the draggable object
            if ((drag.current[index] != 1)) {
                drag.current[index] = 1;

                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});

                const newObject = createNewObject(div, index);
                activeObjects.current.push(newObject);

                // Only create new PlainDraggable instances if the ref is set
                var draggable = new PlainDraggable(div);
                

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
                
                        //console.log("Snapping preview:", currentObject, "to", snap.otherObject);
                    }
                };

                // Maybe we can do a bounds check for if it's over the drawer?
                draggable.onDragEnd = function () {
                    // Get mouse coords
                    //console.log(`dropped with mouse pos (${mouse.x}, ${mouse.y})`);

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
                
                        console.log("Unsnapped:", currentObject);
                    }
  
                    if (mouse.x < 250) {
                        // somehow remove this
                        console.error(`TODO: Implement despawning div!`);
                        
                        //extAction(divRefs[index]);
                    }
                };

                // Draggables can be given a starting position as offset from top-left corner
                draggable.top = 100;
                draggable.left = 150;

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
                       (point.type === "right" && !currentObject.rightLink);
            })
            .map(point => ({
                type: point.type,
                x: point.type === "left" ? currentRect.left : currentRect.right,
                y: currentRect.top + currentRect.height / 2,
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
                           (point.type === "right" && !otherObject.rightLink);
                })
                .map(point => ({
                    type: point.type,
                    x: point.type === "left" ? otherRect.left : otherRect.right,
                    y: otherRect.top + otherRect.height / 2,
                }));
    
            // Compare current snap points with other snap points
            currentSnapPoints.forEach(currentPoint => {
                otherSnapPoints.forEach(otherPoint => {
                    // Ensure left snap points only snap to right snap points and vice versa
                    const isValidSnap =
                        (currentPoint.type === "left" && otherPoint.type === "right") ||
                        (currentPoint.type === "right" && otherPoint.type === "left");
    
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

    function createNewObject(div, index) {
        return {
            id: `object${index}`,
            element: div,
            leftLink: null,
            rightLink: null,
            snapPoints: [
                { type: "left" },
                { type: "right" },
            ],
        };
    }

    return (
        <div id="stage" className="teststage">
            {
                elements.map((item, index) => {
                    return (
                        <TestDiv 
                            key={item.name} 
                            name={item.name} 
                            ref={el => divRefs.current[index] = el}
                            handleRef={el => handleRefs.current[index] = el} // Set handle ref for each TestDiv
                            action={extAction}
                        />
                    );
                })
            }
        </div>
    );
}
