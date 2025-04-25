import React, {act, useState} from "react";
import ReactDOM from "react-dom";
import { NeuronObject, OutputLayerObject, ActivationObject, DataBatcher } from "./LayerObjects";
import "./Toolbar.css";
import activationInternals from "../../assets/activation-internals.png";
import neuronInternals from "../../assets/neuron-internals.png";
import dataBatcherInfo from "../../assets/data-batcher.svg";

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
                {Array.isArray(content) ? (
                    content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))
                ) : (
                    <p>{content}</p>
                )}
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
                    InfoClick={() => 
                        showOverlay([
                            "The data batcher splits the training examples into groups called \"batches\".",
                            "This allows the model to learn from multiple examples at once\
                            which speeds up the training process."
                        ], dataBatcherInfo)}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="neuron"
                    N={12}
                    count={getObjectCount(elements, "neuron")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => 
                        showOverlay([
                            "Neurons are the basic building blocks of neural networks.",
                            "They are inspired by biological neurons and are used to process and transmit information.",
                            "Each neuron takes inputs, mutiplies them by some value (called a weight), adds a bias (or offset), and then outputs the result. This is works like the simple linear function: y = mx + b",
                            <><strong> Stack neurons vertically to form layers. Combine multiple layers to form a neural network.</strong></>
                        ], neuronInternals)}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="activation"
                    subtype="relu"
                    N={3}
                    count={getObjectCount(elements, "activation")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() => 
                        showOverlay([
                            "Activation functions are critical in neural networks and are used to modify the output of neuron layers.",
                            "They introduce non-linearity into the model, allowing it to learn complex patterns in the data.",
                            "Without activation functions, the model would be a simple linear function, limiting its ability to learn.",
                            <><strong> It is recommended to use activation functions between each neuron layer.</strong></>
                        ], activationInternals)}
                />
                <div className="toolbarObjectDivider" />
                <ToolbarObject
                    type="output"
                    N={1}
                    count={getObjectCount(elements, "output")}
                    createNodeFunction={createNodeFunction}
                    InfoClick={() =>
                        showOverlay([
                            "The output layer is the final step in a neural network. While the internals of a neural network are just numbers being multiplied, added, and transformed, the output layer applies a function to convert these numbers into probabilities.",
                            "These probabilities represent the model's confidence in its predictions. For example, in a classification task, the output layer might assign probabilities to different categories, such as 70% for 'cat' and 30% for 'dog.'",
                            <><strong>It’s important to understand that AI is fundamentally about probabilities.</strong> The output layer doesn’t give definitive answers—it provides the likelihood of each possible outcome based on the patterns it has learned from the data. This is why AI predictions are not absolute truths but rather informed guesses based on probabilities.</>
                        ])
                    }
                />
            </div>

            {overlayContent && <Overlay content={overlayContent} imageSrc={overlayImage} onClose={hideOverlay} />}
        </>
    );
};



export default Toolbar;