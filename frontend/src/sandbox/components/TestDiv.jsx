import React, { forwardRef } from "react";

// Forward ref to pass the ref down to the DOM element
function TestDiv({ name , ref, handleRef }) {
    return (
        <div ref={ref} id={name} className="testdraggable">
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Drag here.</p>
            </div>
            <p>Layer type: 
                <span>
                    <select name={name + "type"} id={name + "layertype"}>
                        <option value="dense">Dense</option>
                        <option value="dropout">Dropout</option>
                    </select>
                </span>
            </p>
        </div>
    );
};

export default TestDiv;
