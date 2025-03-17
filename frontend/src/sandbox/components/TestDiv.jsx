/* TestDiv.jsx
  *
  * AUTHOR(S): Mark Taylor
  *
  * PURPOSE: Test node component for sandbox enviroment.
  * 
  * NOTES: Once actual nodes are created, this should be removed.
  */

import React, { forwardRef } from "react";
import test from "../../assets/test.png";

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
            <img src={test} width="100" height="100" style={{borderRadius: "5px"}}/>
        </div>
    );
};

export default TestDiv;
