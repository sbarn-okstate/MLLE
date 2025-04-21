import React from "react";
import { NeuronObject, OutputLayerObject, ActivationObject, DataBatcher } from "./LayerObjects";
import "./Toolbar.css";

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

const Toolbar = ({ createNodeFunction, elements }) => (
    <div className="toolbarOverlay">
        <ToolbarObject
            type="dataBatcher"
            N={1}
            count={getObjectCount(elements, "dataBatcher")}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Data Batcher info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="neuron"
            N={12}
            count={getObjectCount(elements, "neuron")}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Neuron info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="activation"
            subtype="relu"
            N={3}
            count={getObjectCount(elements, "activation")}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Activation info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="output"
            N={1}
            count={getObjectCount(elements, "output")}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Output layer info")}
        />
    </div>
);



export default Toolbar;