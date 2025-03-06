import React, { forwardRef } from "react";

// Forward ref to pass the ref down to the DOM element
const TestDiv = forwardRef(({ name }, ref) => {
    return (
        <div ref={ref} id={name} className="testdraggable">
            <p>Layer type: 
                <span>
                    <select name="type" id="layertype">
                        <option value="dense">Dense</option>
                        <option value="dropout">Dropout</option>
                    </select>
                </span>
            </p>
        </div>
    );
});

export default TestDiv;
