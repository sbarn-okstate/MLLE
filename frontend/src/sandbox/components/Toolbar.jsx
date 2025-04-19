import React from "react";
import { NeuronObject, OutputLayerObject, ReluObject } from "./LayerObjects";
import "./Toolbar.css";

const ToolbarObject = ({ type, N = 1, count = 0, createNodeFunction, InfoClick }) => {
    let CenterComponent = null;
    switch (type) {
        case "neuron":
            CenterComponent = <NeuronObject linkStates={{}}/>; 
            break;
        case "output":
            CenterComponent = <OutputLayerObject/>;
            break;
        case "relu":
            CenterComponent = <ReluObject/>;
            break;
        default:
            CenterComponent = null;
    }

    return (
        <div className="toolbarObjectContainer">
            <div
                className="toolbarObjectCenter"
                onClick={() => {
                    if (count < N) createNodeFunction(type);
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
    <div className="topCenterContainer">
        <ToolbarObject
            type="neuron"
            N={12}
            count={getObjectCount(elements, "neuron")}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Neuron info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="relu"
            N={3}
            count={getObjectCount(elements, "relu")}
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