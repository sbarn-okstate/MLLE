import React from "react";
import { NeuronObject, OutputLayerObject, ReluObject } from "./LayerObjects";
import "./Toolbar.css";

const ToolbarObject = ({ type, N = 1, count = 0, createNodeFunction, InfoClick }) => {
    let CenterComponent = null;
    switch (type) {
        case "neuron":
            CenterComponent = <NeuronObject linkStates={{ top: null, left: null, bottom: null, right: null }} />;
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
                onClick={() => createNodeFunction(type)}
                tabIndex={0}
                role="button"
                aria-label={`Add ${type}`}
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

const Toolbar = ({ createNodeFunction }) => (
    <div className="topCenterContainer">
        <ToolbarObject
            type="neuron"
            N={12}
            count={0}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Neuron info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="relu"
            N={3}
            count={0}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Activation info")}
        />
        <div className="toolbarObjectDivider" />
        <ToolbarObject
            type="output"
            N={1}
            count={0}
            createNodeFunction={createNodeFunction}
            InfoClick={() => alert("Output layer info")}
        />
    </div>
);

export default Toolbar;