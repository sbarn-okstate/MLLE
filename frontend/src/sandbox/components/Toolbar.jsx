import React, {act, useState} from "react";
import ReactDOM from "react-dom";
import { NeuronObject, OutputLayerObject, ActivationObject, DataBatcher } from "./LayerObjects";
import "./Toolbar.css";
import activationInternals from "../../assets/activation-internals.png";
import neuronInternals from "../../assets/neuron-internals.png";

const ToolbarObject = ({ type, subtype = null, N = 1, count = 0, createNodeFunction, InfoClick }) => {
    let CenterComponent = null;
    switch (type) {
        case "neuron":
            CenterComponent = <NeuronObject linkStates={{}} classNameOverride="neuron-container toolbar-preview"/>; 
            break;
        case "output":
            CenterComponent = <OutputLayerObject linkStates={{}} classNameOverride="output-container toolbar-preview"/>;
            break;
        case "activation":
            CenterComponent = <ActivationObject linkStates={{}} classNameOverride="activation-container toolbar-preview"/>;
            break;
        case "dataBatcher":
            CenterComponent = <DataBatcher linkStates={{}} classNameOverride="dataBatcher-container toolbar-preview"/>;
            break;
        default:
            CenterComponent = null;
    }

    return (
        <div className="toolbarObjectContainer">
            <div
                className="toolbarObjectCenter"
                onClick={() => {
                    if (count < N) createNodeFunction(type, subtype);
                }}
                tabIndex={0}
                role="button"
                aria-label={`Add ${type}`}
                style={{ opacity: count < N ? 1 : 0.5, pointerEvents: count < N ? "auto" : "none" }}
            >
                {CenterComponent}
            </div>
            <button
                className="toolbarObjectInfo"
                onClick={InfoClick}
                aria-label="Info"
                tabIndex={0}
            >
                ?
            </button>
            <div className="toolbarObjectCounter">
                {count}/{N}
            </div>
        </div>
    );
};
const getObjectCount = (elements, type) =>
    elements.filter(el => el.objectType === type).length;

const Overlay = ({ content, imageSrc, onClose }) => {
    return ReactDOM.createPortal(
        <div className="overlay">
            <div className="overlayContent">
                {imageSrc && (
                        <img
                            src={imageSrc}
                            alt="Overlay Illustration"
                            className="overlayImage"
                        />
                    )}
                <p>{content}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        document.body // Render the overlay outside the toolbar's parent container
    );
};

const Toolbar = ({ createNodeFunction, elements }) => {
    const [overlayContent, setOverlayContent] = useState(null);
    const [overlayImage, setOverlayImage] = useState(null);

    const showOverlay = (content, imageSrc = null) => {
        setOverlayContent(content);
        setOverlayImage(imageSrc);
    };

    const hideOverlay = () => {
        setOverlayContent(null);
        setOverlayImage(null);
    };

    return (
        <>
            <div className="toolbarOverlay">
                <ToolbarObject
                    type="dataBatcher"
                    N={1}
                    count={getObjectCount(elements, "dataBatcher")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => showOverlay("Data Batcher: Processes and batches input data.")}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="neuron"
                    N={12}
                    count={getObjectCount(elements, "neuron")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => showOverlay("Neuron: Processes inputs and applies weights and biases.", neuronInternals)}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="activation"
                    subtype="relu"
                    N={3}
                    count={getObjectCount(elements, "activation")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => showOverlay("Activation: Applies a non-linear transformation to the input.", activationInternals)}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="output"
                    N={1}
                    count={getObjectCount(elements, "output")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => showOverlay("Output Layer: Produces the final output of the model.")}
                />
            </div>

            {overlayContent && <Overlay content={overlayContent} imageSrc={overlayImage} onClose={hideOverlay} />}
        </>
    );
};



export default Toolbar;