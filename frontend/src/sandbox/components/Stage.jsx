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
    DatasetObject,
    DatasetNBC500Object,
    DatasetHeartPredictionObject,
    DatasetBostonHousingObject,
    DatasetMNISTObject,
    DatasetFashionMNISTObject,

    DenseLayerObject,
    ActivationLayerObject,
    ConvolutionLayerObject,
    NeuronObject,
    
    OutputLayerObject,
    
    ReluObject,
    SigmoidObject,
    TanhObject,
    SoftmaxObject,
    
    ConvolutionLayer3x3Object,
    ConvolutionLayer5x5Object,
    ConvolutionLayer7x7Object
 } from './LayerObjects.jsx';
import StartNode from './StartNode.jsx';
import PlainDraggable from "plain-draggable";
import LinkerLine from "linkerline";

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
const Stage = forwardRef(({ elements, drags, setDrags, drawerOpen, modelState }, ref) => {
    const divRefs = useRef([]);
    const handleRefs = useRef([]);
    const drag = useRef([]);
    var lines = [];
    var lineTexts = [];

    //var fired = 0; // test

    function CreateTestLinker() {
        // We need to see if the model is valid
        if(modelState === `valid`) {
            //
            console.info(`LinkerLines DEBUG: Model is validated! Creating lines!`);

            // Find all neurons to get create LinkerLines to and fro
            // Start node has to exist if the model validated
            const startNode = activeObjectsRef.current.find(obj => obj.objectType === "startNode");

            // We need both current and previous object
            let prevObject = startNode;
            let currentObject = startNode.rightLink;
            
            while(currentObject.rightLink != null) {
                console.log(`finding stuff`);
                if(currentObject.objectType === 'neuron') {
                    console.log(`LinkerLines DEBUG: Found a neuron!`);

                    // Create a LinkerLine
                    lineTexts.push(`line${lines.length}`);
                    lines.push(
                        new LinkerLine({
                            start: divRefs.current[(prevObject == startNode) ? 0 : prevObject.id],
                            end: divRefs.current[currentObject.id],
                            middleLabel: LinkerLine.pathLabel(lineTexts[lines.length]),
                            path: `straight`}));
                    lines[lines.length - 1].name = `line${lines.length - 1}`;
                    lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                    // We need to search up and down as well
                    let currentUp = currentObject;
                    let currentDown = currentObject;

                    while(currentUp.topLink != null) {
                        console.log("LinkerLines DEBUG: Found a neuron above!");
                        
                        // Create a LinkerLine
                        lineTexts.push(`line${lines.length}`);
                        lines.push(
                            new LinkerLine({
                                start: divRefs.current[(prevObject == startNode) ? 0 : prevObject.id],
                                end: divRefs.current[currentUp.topLink.id],
                                middleLabel: LinkerLine.pathLabel(lineTexts[lines.length]),
                                path: `straight`}));
                        lines[lines.length - 1].name = `line${lines.length - 1}`;
                        lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                        currentUp = currentUp.topLink;
                    }

                    while(currentDown.bottomLink != null) {
                        console.log("LinkerLines DEBUG: Found a neuron below!");

                        // Create a LinkerLine
                        lineTexts.push(`line${lines.length}`);
                        lines.push(
                            new LinkerLine({
                                start: divRefs.current[(prevObject == startNode) ? 0 : prevObject.id],
                                end: divRefs.current[currentDown.bottomLink.id],
                                middleLabel: LinkerLine.pathLabel(lineTexts[lines.length]),
                                path: `straight`}));
                        lines[lines.length - 1].name = `line${lines.length - 1}`;
                        lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                        currentDown = currentDown.bottomLink;
                    }
                }
                prevObject = currentObject;
                currentObject = currentObject.rightLink;
            }

        }
    }

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
        getStartNode: () => activeObjectsRef.current.find(obj => obj.objectType === "startNode"),
        getActiveObjects: () => activeObjectsRef.current,
        createTestLinker: CreateTestLinker,
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

                // Subscribe to mouse move event listener
                let mouse;
                addEventListener("mousemove", (event) => {mouse = event});
                
                // Create a new PlainDraggable instance
                const draggable = new PlainDraggable(div);

                // Get the type of the object from the elements array
                const snapType = elements[index]?.snapType || "all"; // Default to "all" if type is not specified   
                const objectType = elements[index]?.objectType || `object${index}`;   
                const subType = elements[index]?.subType || `subtype${index}`; // Subtype isn't used for snapping rules currently
                const datasetFileName = elements[index]?.datasetFileName || `dataset${index}`; // Dataset file name isn't used for snapping rules currently
                const newObject = createNewObject(objectType, subType, datasetFileName, div, index, snapType);

                //console.log("Active Objects:", activeObjectsRef.current);

                // Define draggable behavior
                draggable.onMove = function () {
                    // Update the linkerlines
                    LinkerLine.positionAll();

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

                draggable.onDragStart = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    clearLinks(currentObject);
                    //console.log("Dragging:", currentObject);
                }

                draggable.onDragEnd = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjectsRef);
                    clearLinks(currentObject);

                    if (snap) {
                        updateLinks(currentObject, snap);
                        //console.log("Snapped:", currentObject, "to", snap.otherObject);
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

                    // Set left and right links to 0 when snapping to the top
                    obj.leftLink = 0;
                    obj.rightLink = 0;
                } else if (snap.currentPoint.type === "bottom") {
                    obj.bottomLink = snap.otherObject;
                    snap.otherObject.topLink = obj;

                    // Set left and right links to 0 when snapping to the bottom
                    obj.leftLink = 0;
                    obj.rightLink = 0;
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
                            minDistance = distance;
                            closestPoint = { currentPoint, otherPoint, currentObject, otherObject };
                        }
                    }
                });
            });
        });
    
        return closestPoint;
    }

    function createNewObject(objectType, subType, datasetFileName, div, index, snapType = "all") {
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
        };
    
        const updatedObjects = [...activeObjectsRef.current, newObject];
        activeObjectsRef.current = updatedObjects; // Update the ref
        setActiveObjectsState(updatedObjects); // Trigger a re-render
        return newObject;
    }

    function renderObject(objectType, subType, datasetFileName, props) {
        const { key, ...restProps } = props; // Extract the key from props

        const currentObject = activeObjectsState.find(obj => obj.id === props.key);

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
            case "startNode":
                return <StartNode key={key} {...restProps} linkStates={linkStates}/>;
            case "dataset":
            //return <DatasetObject key={key} {...restProps} linkStates={linkStates}/>;
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
            case "dense":
                return <DenseLayerObject key={key} {...restProps} linkStates={linkStates}/>;
            case "activation":
                //return <ActivationLayerObject key={key} {...restProps} />;
                switch (subType) {
                    case "relu":
                        return <ReluObject key={key} {...restProps} linkStates={linkStates} />;
                    case "sigmoid":
                        return <SigmoidObject key={key} {...restProps} linkStates={linkStates}/>;
                    case "tanh":
                        return <TanhObject key={key} {...restProps} linkStates={linkStates}/>;
                    case "softmax":
                        return <SoftmaxObject key={key} {...restProps} linkStates={linkStates}/>;
                }
            case "convolution":
                //return <ConvolutionLayerObject key={key} {...restProps} />;
                switch (subType) {
                    case "3x3":
                        return <ConvolutionLayer3x3Object key={key} {...restProps} linkStates={linkStates}/>;
                    case "5x5":
                        return <ConvolutionLayer5x5Object key={key} {...restProps} linkStates={linkStates}/>;
                    case "7x7":
                        return <ConvolutionLayer7x7Object key={key} {...restProps} linkStates={linkStates}/>;
                }
            case "output":
                return <OutputLayerObject key={key} {...restProps} linkStates={linkStates}/>;
            case "neuron":
                return <NeuronObject key={key} {...restProps} linkStates={linkStates} />;
            default:
                return null;
        }
    }

    return (
        <div id="stage" className="stage">
            {elements.map((item, index) => (
                renderObject(item.objectType, item.subType, item.datasetFileName,{
                    key: index,
                    name: item.id,
                    ref: (el) => (divRefs.current[index] = el),
                    handleRef: (el) => (handleRefs.current[index] = el),
                    action: extAction
                })
            ))}
        </div>
    );
});

export default Stage;
