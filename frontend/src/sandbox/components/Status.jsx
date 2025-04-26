/* Status.jsx
  * AUTHOR(S): Samuel Barney
  */

import React from "react";
import "./Status.css";

function Status({ title = "Status", content = []}) {
    return (
        <div className="statusContainer">
            <div className="statusHeader">
                <h3>{title}</h3>
            </div>
            <div className="statusContent">
                {content.length > 0 ? (
                    content.map((item, index) => (
                        <p key={index} className="statusItem">
                            {item}
                        </p>
                    ))
                ) : (
                    <p className="statusPlaceholder">No data available</p>
                )}
            </div>
        </div>
    );
}

export default Status;