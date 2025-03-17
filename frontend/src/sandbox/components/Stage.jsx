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

    // draggables do not know about state variables? so the need an external helper
    function extAction(ref) {
        console.log(`an element has called for external action: ${typeof ref}`);
    }

    useEffect(() => {
        // This useEffect runs after the components are rendered
        divRefs.current.forEach((div, index) => {
            // We need to make sure that we do not recreate the draggable object
            if ((drag.current[index] != 1)) {
                drag.current.push(1);
                console.log(`length: ${drag.current}`);

                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});

                // Only create new PlainDraggable instances if the ref is set
                var draggable = new PlainDraggable(div);

                // Add the onMove callback
                draggable.onMove = function () {
                    //const allElements = Array.from(elements.current.values());
                    const snap = findClosestSnapPoint(div, divRefs);
          
                    if (snap) {
                        const dx = snap.otherPoint.x - snap.elPoint.x;
                        const dy = snap.otherPoint.y - snap.elPoint.y;
                        draggable.left += dx;
                        draggable.top += dy;
                    }
                };

                // Draggables can be given a starting position as offset from top-left corner
                draggable.top = 100;
                draggable.left = 150;

                // Visually above everything for dragging into node drawer for deletion
                draggable.onDrag = function () {
                    draggable.zIndex = 99000;
                }

                // Maybe we can do a bounds check for if it's over the drawer?
                draggable.onDragEnd = function() {
                    // Get mouse coords
                    console.log(`dropped with mouse pos (${mouse.x}, ${mouse.y})`);
                    if (mouse.x < 250) {
                        // somehow remove this
                        console.error(`TODO: Implement despawning div!`);
                        
                        //extAction(divRefs[index]);
                    }
                }

                // Set the handle
                draggable.handle = handleRefs.current[index];

                // Do not override the cursor
                draggable.draggableCursor = false;
                draggable.draggingCursor = false;

                setDrags(prev => [...prev, draggable]);
            }
        });
    }, [elements, setDrags]);

    // assign snapping points to element
    function getSnapPoints(el) {
        if (!el) return [];
        // troubleshoot
        //console.log(`el type: ${typeof el}`);
        const rect = el.getBoundingClientRect();
            return [
                { x: rect.left, y: rect.top + rect.height / 2 }, // Left-center
                { x: rect.right, y: rect.top + rect.height / 2 }, // Right-center
                { x: rect.left + rect.width / 2, y: rect.top }, // Top-center
                { x: rect.left + rect.width / 2, y: rect.bottom }, // Bottom-center
            ];
        }

    // custom snapping behavior
    function findClosestSnapPoint(el, elementsList) {
        const elSnapPoints = getSnapPoints(el);
        let closestPoint = null;
        let minDistance = 20; // Max snap distance
    
        elementsList.current.forEach((otherEl) => {
        if (otherEl === el) return;
        const otherSnapPoints = getSnapPoints(otherEl);
    
        elSnapPoints.forEach((elPoint) => {
            otherSnapPoints.forEach((otherPoint) => {
                const distance = Math.hypot(elPoint.x - otherPoint.x, elPoint.y - otherPoint.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPoint = { elPoint, otherPoint };
                    }
                });
            });
        });
    
        return closestPoint;
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
