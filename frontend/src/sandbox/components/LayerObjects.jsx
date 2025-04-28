/* LayerObjects.jsx
  *
  * AUTHOR(S): Mark Taylor, Justin Moua, Samuel Barney
  *
  * PURPOSE: Node components for sandbox enviroment.
  * 
  * NOTES: Once actual nodes are created, this should be removed.
  *        These are called from NodeDrawer.jsx. 
  * 
  * *       LayerObjects.jsx contains the following functions:
  * *               - renderLinkedIndicators(): Helper function to render all link indicators
  
  * *               - DatasetObject(): Dataset object that corresponds with synthetic_normal_binary_classification_500.csv
  * *               - DatasetNBC500Object(): Dataset object that corresponds with synthetic_normal_binary_classification_500.csv
  
  * *               - DenseLayerObject(): Dense layer object
  * *               - NeuronObject(): Neuron object
  
  * *               - ActivationLayerObject(): Activation layer object
  * * *                 - ReluObject(): Relu object
  * * *                 - SigmoidObject(): Sigmoid object
  * * *                 - TanhObject(): Tanh object
  * * *                 - SoftmaxObject(): Softmax object
  
  * * *               - ConvolutionLayerObject(): Convolution layer object
  * * *                 - ConvolutionLayer3x3Object(): Convolution layer object with 3x3 filter size
  * * *                 - ConvolutionLayer5x5Object(): Convolution layer object with 5x5 filter size
  * * *                 - ConvolutionLayer7x7Object(): Convolution layer object with 7x7 filter size
  
  * * *               - OutputLayerObject(): Output layer object  
  */

import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import "./LayerObjects.css";
import "./LayerObjects/Datasets.css";
import "./LayerObjects/Neuron.css";
import "./LayerObjects/Activation.css";
import "./LayerObjects/DataBatcher.css";
import "./LayerObjects/Output.css";

import { datasetDefaults }from "../../backend/dataset-defaults";

import openLinkLR from "../../assets/openLinkLR.svg";
import openLinkTB from "../../assets/openLinkTB.svg";
import closedLinkLR from "../../assets/closedLinkLR.svg";
import closedLinkTB from "../../assets/closedLinkTB.svg";
import dataBatcherGraphic from "../../assets/data-batcher.svg";
import enlargeIcon from "../../assets/fullscreen-out.svg";

const openLinkLeft = openLinkLR;
const openLinkRight = openLinkLR;
const openLinkTop = openLinkTB;
const openLinkBottom = openLinkTB;
const closedLinkLeft = closedLinkLR;
const closedLinkRight = closedLinkLR;
const closedLinkTop = closedLinkTB;
const closedLinkBottom = closedLinkTB;  

// Helper function to render all link indicators
export function renderLinkIndicators(linkStates, height = 100, width = 200) {
    const x_center = width / 2;
    const y_center = height / 2;

    const positionToAltText = {
        top: "Top Link",
        right: "Right Link",
        bottom: "Bottom Link",
        left: "Left Link",
    };

    const positionToSVG = {
        top: openLinkTop,
        bottom: openLinkBottom,
        left: openLinkLeft,
        right: openLinkRight,
    };

    const closedPositionToSVG = {
        top: closedLinkTop,
        bottom: closedLinkBottom,
        left: closedLinkLeft,
        right: closedLinkRight,
    };

    // Map positions to coordinates (center of indicator at edge)
    const indicatorSize = 32; // px, adjust as needed
    const positionToCoords = {
        top:    { x: x_center, y: 10 },
        right:  { x: width - 10,    y: y_center },
        bottom: { x: x_center, y: height - 10 },
        left:   { x: 10,        y: y_center },
    };

    return (
        <>
            {/* SVG lines */}
            <svg
                className="link-indicator-svg"
                width={width}
                height={height}
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                {Object.entries(linkStates).map(([position, value]) => {
                    if (value === 0) return null;
                    const { x, y } = positionToCoords[position];
                    return (
                        <line
                            key={position}
                            x1={x_center}
                            y1={y_center}
                            x2={x}
                            y2={y}
                            stroke={value ? "white" : "grey"}
                            strokeWidth="1"
                            strokeDasharray={value ? "0" : "4 4"}
                            z-index={0}
                        />
                    );
                })}
            </svg>
            {/* Link indicator icons */}
            {Object.entries(linkStates).map(([position, value]) => {
                if (value === 0) return null;
                const src = value ? closedPositionToSVG[position] : positionToSVG[position];
                const alt = positionToAltText[position] || "Link";
                const { x, y } = positionToCoords[position];
                return (
                    <img
                        key={position}
                        src={src}
                        alt={alt}
                        className={`link-indicator ${position}-link`}
                    />
                );
            })}
        </>
    );
}


// Custom reach hook to get container dimensions
export function useContainerDimensions(forwardedRef, defaultDims = { width: 400, height: 250 }) {
    const localRef = useRef(null);
    const [dimensions, setDimensions] = useState(defaultDims);

    // Combined ref callback
    const setRefs = useCallback(
        (el) => {
            localRef.current = el;
            if (typeof forwardedRef === "function") forwardedRef(el);
            else if (forwardedRef) forwardedRef.current = el;
        },
        [forwardedRef]
    );

    useEffect(() => {
        if (localRef.current) {
            const rect = localRef.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        }
    }, []);

    return [setRefs, dimensions];
}


export function DataBatcher({ ref, handleRef, name, classNameOverride = "dataBatcher-container", displayText = "", linkStates = {} }) {
    const isPreview = classNameOverride.includes("toolbar-preview");
    const [setRefs, dimensions] = useContainerDimensions(ref);

    if (isPreview) {
        return (
            <div ref={ref} id={name} className="dataBatcher-container toolbar-preview">
                <div className="dataBatcher-title">Data Batcher</div>
            </div>
        );
    }

    return (
        <div 
            ref={setRefs} 
            id={name} 
            className={classNameOverride}
            >   
            <div ref={handleRef} className="dataBatcher">
                <div className="dataBatcher-title">Data Batcher</div>
                {!isPreview && (
                    <>
                        <div className="dataBatcher-display">
                            {displayText}
                        </div>
                        {/*}
                        <div className="dataBatcher-graphic">
                                <img
                                    src={dataBatcherGraphic}
                                    alt="Data Batcher Graphic"
                                    style={{ width: "160px", height: "auto", display: "block", margin: "0 auto" }}
                                />
                            </div>
                            */}
                    </>
                )}
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, dimensions.height, dimensions.width)}
        </div>
    );
}


// Neuron Object
export function NeuronObject({ name, ref, handleRef, classNameOverride = "neuron-container", linkStates = {} }) {
    const isPreview = classNameOverride.includes("toolbar-preview");
    const [setRefs, dimensions] = useContainerDimensions(ref);

    return (
        <div
            ref={setRefs}
            id={name}
            className={classNameOverride}
        >
            {/* Draggable handle in the center */}
            <div 
                ref={handleRef} 
                className={`neuron${isPreview ? " toolbar-preview" : ""}`}
                >
                <p className="nodeDragText">Neuron</p>
            </div>

            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, dimensions.height, dimensions.width)}
        </div>
    );
}

// Activation Layer Object
export function ActivationObject({ name, ref, handleRef, classNameOverride = "activation-container", linkStates = {}}) {
    const isPreview = classNameOverride.includes("toolbar-preview");
    const [setRefs, dimensions] = useContainerDimensions(ref);

    return (
        <div
            ref={setRefs}
            id={name}
            className={classNameOverride}
        >
            {/* Draggable handle in the center */}
            <div
                ref={handleRef}
                className={`activation${isPreview ? " toolbar-preview" : ""}`}
            >
                <p className="nodeDragText">Activation Function</p>
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, dimensions.height, dimensions.width)}
        </div>
    );
}


// Output Layer Object for Classification (Batch Animation)
export function OutputLayerObject({
    name,
    ref,
    handleRef,
    classNameOverride = "output-container",
    predictions = [7, 2, 1, 9], //example values
    confidences = [0.92, 0.85, 0.60, 0.99],
    targets = [9, 2, 1, 7],
    losses = [0.35, 0.12, 0.22, 0.40],
    step = "forward",
    explanation = "",
    linkStates = {},
}) {
    // Calculate batch accuracy
    const correctCount = predictions.reduce((acc, pred, i) => acc + (pred === targets[i] ? 1 : 0), 0);
    const accuracy = ((correctCount / predictions.length) * 100).toFixed(1);

    const isPreview = classNameOverride.includes("toolbar-preview");
    const [setRefs, dimensions] = useContainerDimensions(ref);

    if (isPreview) {
        return (
            <div ref={ref} id={name} className="output-container toolbar-preview">
                <div className="output-title">Output Layer</div>
            </div>
        );
    }

    return (
        <div ref={setRefs} id={name} className={classNameOverride}>
            <div ref={handleRef} className="output">
                <div className="output-title">Output Layer</div>
                <div className="output-batch-table">
                    <div className="output-batch-header">
                        <span>Sample</span>
                        <span>Prediction</span>
                        <span>Confidence</span>
                        <span>Target</span>
                        <span>Loss</span>
                    </div>
                    {predictions.map((pred, i) => (
                        <div
                            key={i}
                            className="output-batch-row"
                        >
                            <span>{i + 1}</span>
                            <span>{pred}</span>
                            <span>{(confidences[i] * 100).toFixed(1)}%</span>
                            <span>{targets[i]}</span>
                            <span>{losses[i].toFixed(3)}</span>
                        </div>
                    ))}
                </div>
                <div className="output-batch-summary">
                    Batch predictions: <b>{correctCount} out of {predictions.length}</b> correct ({accuracy}%)
                </div>
                <div className="output-explanation">
                    {explanation}
                </div>
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, dimensions.height, dimensions.width)}
        </div>
    );
}


export function DatasetObject({
    name,
    ref,
    handleRef,
    classNameOverride = "dataset-container",
    fileName = "",
    imageSrc = null,
    linkStates = {}
}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [setRefs, dimensions] = useContainerDimensions(ref);

    // Fetch dataset information from datasets_defaults
    const datasetInfo = datasetDefaults[fileName] || {};
    const {
        datasetLabel = "Unknown Dataset",
        inputs = "Unknown Inputs",
        outputs = "Unknown Outputs",
        description = "No description available.",
        graph = imageSrc, // Use the provided imageSrc as a fallback
    } = datasetInfo;

    const inputsText = Array.isArray(inputs) ? inputs.join(", ") : inputs;
    const outputsText = Array.isArray(outputs) ? outputs.join(", ") : outputs;

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <div ref={setRefs} id={name} className={classNameOverride}>
            <div
                ref={handleRef}
                className="dataset-interactive"
                tabIndex={0}
                role="group"
            >
                <div className="dataset-label">{datasetLabel}</div>
                <table className="dataset-table">
                    <tbody>
                        <tr>
                            <td className="dataset-table-key">Inputs:</td>
                            <td className="dataset-table-value">{inputsText}</td>
                        </tr>
                        <tr>
                            <td className="dataset-table-key">Classes:</td>
                            <td className="dataset-table-value">{outputsText}</td>
                        </tr>
                        <tr>
                            <td className="dataset-table-key">Goal:</td>
                            <td className="dataset-table-value">{description}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="dataset-image-wrapper">
                    <img
                        src={graph}
                        alt={`${datasetLabel} Graph`}
                        className="dataset-image"
                    />
                    <button
                        className="dataset-popup-button"
                        onClick={openPopup}
                        aria-label="View Larger Graph"
                    >
                        <img
                            src={enlargeIcon}
                            alt="Enlarge Icon"
                            className="dataset-popup-icon"
                        />
                    </button>
                </div>
            </div>
            {/* Render all link indicators */}
            {renderLinkIndicators(linkStates, dimensions.height, dimensions.width)}

            {/* Popup for larger image */}
            {isPopupOpen &&
                ReactDOM.createPortal(
                    <div
                        className="dataset-popup-overlay"
                        onClick={closePopup}
                    >
                        <div
                            className="dataset-popup-content"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
                        >
                            <img
                                src={graph}
                                alt={`Larger ${datasetLabel} Graph`}
                                className="dataset-popup-image"
                            />
                            <button
                                className="dataset-popup-close"
                                onClick={closePopup}
                                aria-label="Close Popup"
                            >
                                ✖
                            </button>
                        </div>
                    </div>,
                    document.body // Render the popup at the root level of the DOM
                )}
        </div>
    );
}