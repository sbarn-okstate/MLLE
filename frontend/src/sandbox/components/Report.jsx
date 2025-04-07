import React from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import "./Report.css";

function Report({ title = "Report", content = [], graphData = [] }) {
    // Define scales for the graph
    const xScale = scaleLinear({
        domain: [0, graphData.length - 1],
        range: [0, 280], // Width of the graph
    });

    const yScale = scaleLinear({
        domain: [0, Math.max(...graphData.map(d => d.y), 1)], // Ensure non-zero domain
        range: [150, 0], // Height of the graph (inverted for SVG coordinates)
    });
    return (
        <div className="reportContainer">
            <div className="reportHeader">
                <h3>{title}</h3>
            </div>
            <div className="reportContent">
                {content.length > 0 ? (
                    content.map((item, index) => (
                        <p key={index} className="reportItem">
                            {item}
                        </p>
                    ))
                ) : (
                    <p className="reportPlaceholder">No data available</p>
                )}
            </div>
            <div className="reportGraph">
                <svg width={300} height={200}>
                    <LinePath
                        data={graphData}
                        x={(d, i) => xScale(i)}
                        y={d => yScale(d.y)}
                        stroke="#007bff"
                        strokeWidth={2}
                        curve={curveMonotoneX}
                    />
                </svg>
            </div>
        </div>
    );
}

export default Report;