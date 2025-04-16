import React from "react";
import { NeuronObject, OutputLayerObject } from "./LayerObjects";

const Toolbar = ({ createNodeFunction }) => (
    <div className="topCenterContainer">
        <div style={{ cursor: "pointer" }} onClick={() => createNodeFunction("neuron")}>
            <NeuronObject classNameOverride="drawerNode" />
        </div>
        <div style={{ cursor: "pointer" }} onClick={() => createNodeFunction("output")}>
            <OutputLayerObject classNameOverride="drawerNode" />
        </div>
        {/* Add more toolbar items here if needed */}
    </div>
);

export default Toolbar;