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
import DataBatcher from './DataBatcher.jsx';
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
const Stage = forwardRef(({ elements, drags, setDrags, AddObject, RemoveObject, drawerOpen, modelState}, ref) => {
    const stageRef = useRef(null);
    const divRefs = useRef([]);
    const handleRefs = useRef([]);
    const drag = useRef([]);
    var lines = [];
    var lineTexts = [];

    // Creates LinkerLines for dense layers
    function CreateLinkerLines() {
        LinkerLine.removeAll();
        lines = [];
        lineTexts = [];

        // We need to see if the model is valid first and foremost
        if(modelState === `valid`) {
            //console.info(`LinkerLines DEBUG: Model is validated! Creating lines!`);

            // Data batcher has to exist if the model validated
            const dataBatcher = activeObjectsRef.current.find(obj => obj.objectType === "dataBatcher");

            // We need both current and previous object
            let prevObject = dataBatcher;
            let currentObject = dataBatcher.rightLink;
            
            // As far as I know
            //  - The first dense layer needs connections to the object to its left
            //  - All further dense layers need to be fully connected to each other
            //  - The last dense layer needs to connect to the output node
            let firstDense = true;

            // // TEST TEST TEST
            // console.log(`LinkerLine DEBUG: Beginning 1D traversal test...`);
            // while(currentObject.rightLink != null) {
            //     console.log(`${currentObject.objectType} -> ${currentObject.rightLink.objectType}`);
            //     currentObject = currentObject.rightLink;
            // }
            // // TEST TEST TEST

            currentObject = dataBatcher.rightLink;

            while(currentObject.rightLink != null) {
                if(currentObject.objectType === 'neuron') {
                    //console.log(`LinkerLines DEBUG: Found a neuron/dense layer!`);

                    if (firstDense) {
                        // Being the first has a special case, fully connected to starting node

                        // More efficient and clean line creating algorithm
                        // We need to traverse to the top of the dense layer
                        let currentLayerNode = currentObject;
                        while(currentLayerNode.topLink != null) {
                            // We aren't at the top of the layer yet
                            currentLayerNode = currentLayerNode.topLink;
                        }

                        // Now that we are at the top of the layer, we can go down and create the lines
                        while(currentLayerNode != null) {
                            // Create a LinkerLine
                            //console.log("LinkerLine DEBUG: Creating a LinkerLine for first dense layer!");
                            lineTexts.push(`line${lines.length}`);
                            lines.push(
                                new LinkerLine({
                                    start: divRefs.current[(prevObject == dataBatcher) ? 0 : prevObject.id],
                                    end: handleRefs.current[currentLayerNode.id],
                                    endLabel: lineTexts[lines.length],
                                    path: `straight`}));
                            lines[lines.length - 1].name = `line${lines.length - 1}`;
                            lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                            currentLayerNode = currentLayerNode.bottomLink;
                        }

                        firstDense = !firstDense; // Flip firstDense so we know we have passed the first dense layer
                    }

                    // Now that we have established the position of the current dense layer we need to see if there is
                    // another dense layer...
                    let nextDenseLayer = currentObject;
                    let noLayer = true;

                    // We are only looking for the next dense layer
                    //while((nextDenseLayer.objectType != "neuron") && noLayer) {
                    while((nextDenseLayer.rightLink != null) && noLayer) {
                        if(nextDenseLayer.rightLink.objectType === "neuron") {
                            // Break the while loop because we found the next dense layer
                            noLayer = false;
                        }
                        nextDenseLayer = nextDenseLayer.rightLink;
                    }

                    if (noLayer === false) {
                        // If we are here, there is another dense layer to connect to
                        let currentLayerNode = currentObject;
                        let currentNextLayerTopNode = nextDenseLayer;

                        // Traverse to the tops of the dense layers
                        while(currentLayerNode.topLink != null) {
                            // We aren't at the top of the layer yet
                            currentLayerNode = currentLayerNode.topLink;
                        }

                        while(currentNextLayerTopNode.topLink != null) {
                            // We aren't at the top of the layer yet
                            currentNextLayerTopNode = currentNextLayerTopNode.topLink;
                        }

                        // Create a new variable so that we don't have to traverse the dense layer up again
                        let currentNextLayerNode = currentNextLayerTopNode;

                        //console.log(`linkerline from ${currentLayerNode.objectType} to ${currentNextLayerNode.objectType} ??`);

                        // Create the fully connected LinkerLines between the dense layers
                        while(currentLayerNode != null) {
                            while(currentNextLayerNode != null) {
                                // Create LinkerLines
                                lineTexts.push(`line${lines.length}`);
                                lines.push(
                                    new LinkerLine({
                                        //start: divRefs.current[(currentLayerNode == dataBatcher) ? 0 : currentLayerNode.id],
                                        start: handleRefs.current[currentLayerNode.id],
                                        end: handleRefs.current[currentNextLayerNode.id],
                                        endLabel: lineTexts[lines.length],
                                        path: `straight`}));
                                lines[lines.length - 1].name = `line${lines.length - 1}`;
                                lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                                currentNextLayerNode = currentNextLayerNode.bottomLink;
                            }

                            currentLayerNode = currentLayerNode.bottomLink;
                            currentNextLayerNode = currentNextLayerTopNode;
                        }

                    } else {
                        // We didn't find another dense layer, so we need to create lines to the end node
                        // TODO

                        // We need to traverse to the top of the dense layer
                        let currentLayerNode = currentObject;
                        while(currentLayerNode.topLink != null) {
                            // We aren't at the top of the layer yet
                            currentLayerNode = currentLayerNode.topLink;
                        }

                        // Now that we are at the top of the layer, we can go down and create the lines
                        while(currentLayerNode != null) {
                            // Create a LinkerLine
                            //console.log("LinkerLine DEBUG: Creating a LinkerLine for first dense layer!");
                            lineTexts.push(`line${lines.length}`);
                            lines.push(
                                new LinkerLine({
                                    start: handleRefs.current[currentLayerNode.id],
                                    end: divRefs.current[nextDenseLayer.id],
                                    endLabel: lineTexts[lines.length],
                                    path: `straight`}));
                            lines[lines.length - 1].name = `line${lines.length - 1}`;
                            lines[lines.length - 1].setOptions({startSocket: 'right', endSocket: 'left'});

                            currentLayerNode = currentLayerNode.bottomLink;
                        }
                    }
                }

                prevObject = currentObject;
                currentObject = currentObject.rightLink;
            }

        } else {
            console.log("LinkerLines: LinkerLines cannot be created as the model is not validated!");
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


    // 2. Expose dataBatcher and activeObjects via the ref
    useImperativeHandle(ref, () => ({
        getStageElement: () => stageRef.current,
        getDataBatcher: () => activeObjectsRef.current.find(obj => obj.objectType === "dataBatcher"),
        getActiveObjects: () => activeObjectsRef.current,
        createLinkerLines: CreateLinkerLines,
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
                const active = elements[index]?.active
                const location = elements[index]?.location || {x: 0, y: 0}; // Default to (0, 0) if not specified
                const newObject = createNewObject(objectType, subType, datasetFileName, div, index, snapType, active);

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

                    
                    if (!currentObject.isActive && false) {
                        if(currentObject.objectType === "neuron"){
                            AddObject(currentObject.objectType, currentObject.subType, currentObject.datasetFileName, true, {x: 400, y: 50});
                        }
                        else if (currentObject.objectType === "output"){
                            AddObject(currentObject.objectType, currentObject.subType, currentObject.datasetFileName, true, {x: 200, y: 50});
                        }
                        currentObject.isActive = true;
                    }

                }

                draggable.onDragEnd = function () {
                    const currentObject = activeObjectsRef.current.find(obj => obj.element === div);
                    const snap = findClosestSnapPoint(currentObject, activeObjectsRef);
                    clearLinks(currentObject);

                    if (snap) {
                        updateLinks(currentObject, snap);
                        //console.log("Snapped:", currentObject, "to", snap.otherObject);
                    }

                    if (mouse.y < 250) {
                        // somehow remove this
                        console.error(`TODO: Implement despawning div!`);
                        
                        //extAction(divRefs[index]);
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
                            minDistance = distance;
                            closestPoint = { currentPoint, otherPoint, currentObject, otherObject };
                        }
                    }
                });
            });
        });
    
        return closestPoint;
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
            case "dataBatcher":
                return <DataBatcher key={key} {...restProps} linkStates={linkStates}/>;
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
        <div id="stage" className="stage" ref={stageRef}>
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
