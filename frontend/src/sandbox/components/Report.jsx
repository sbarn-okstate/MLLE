import React, { useImperativeHandle, useState, forwardRef } from "react";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { curveMonotoneX } from "@visx/curve";
import { AxisBottom, AxisLeft } from "@visx/axis"; // Import axis components
import "./Report.css";

const Report = forwardRef(({ title = "Training Report" }, ref) => {
    const [graphData, setGraphData] = useState([]); // Data for the graph
    const [accuracy, setAccuracy] = useState(0); // Current accuracy percentage

    const width = 300; // Width of the graph
    const height = 200; // Height of the graph
    const margin = { top: 10, right: 10, bottom: 10, left: 50 }; // Margins for axes

    // Define scales for the graph
    const xScale = scaleLinear({
        domain: [0, Math.max(graphData.length - 1, 1)], // Epochs
        range: [margin.left, width - margin.right], // Adjust for margins
    });

    const yScale = scaleLinear({
        domain: [0, 1], // Accuracy percentage (0% to 100%)
        range: [height - margin.bottom, margin.top], // Inverted for SVG coordinates
    });

    // Expose methods to the parent component via the ref
    useImperativeHandle(ref, () => ({
        addGraphData(epoch, accuracy) {
            setGraphData(prevData => [
                ...prevData,
                { epoch, accuracy }
            ]);
        },
        updateAccuracy(newAccuracy) {
            setAccuracy(newAccuracy * 100); // Convert to percentage
        },
        clearGraphData() {
            setGraphData([]);
        }
    }));

    // Determine the color of the accuracy percentage based on its value
    const getAccuracyColor = () => {
        if (accuracy <= 50) return "red"; // 0% - 50%
        if (accuracy <= 60) return "orange"; // 51% - 60%
        if (accuracy <= 70) return "yellow"; // 61% - 70%
        if (accuracy <= 80) return "lightgreen"; // 71% - 80%
        if (accuracy <= 90) return "green"; // 81% - 90%
        if (accuracy <= 95) return "darkgreen"; // 91% - 95%
        return "blue"; // 96% - 100%
    };

    return (
        <div className="reportContainer">
            <div className="reportHeader">
                <h3>{title}</h3>
            </div>
            <div className="reportGraph">
            <svg width={width} height={height+30}>
                    {/* Line for Accuracy */}
                    <LinePath
                        data={graphData}
                        x={d => xScale(d.epoch)}
                        y={d => yScale(d.accuracy)}
                        stroke="#007bff"
                        strokeWidth={2}
                        curve={curveMonotoneX}
                    />
                    {/* X-Axis (Epochs) */}
                    <AxisBottom
                        top={height - margin.bottom}
                        scale={xScale}
                        numTicks={5}
                        tickLength={5}
                        stroke="none"
                        tickStroke="#333"
                        tickLabelProps={() => ({
                            fill: "#333",
                            fontSize: 10,
                            textAnchor: "middle",
                        })}
                    />
                    {/* Y-Axis (Accuracy) */}
                    <AxisLeft
                        left={margin.left}
                        scale={yScale}
                        numTicks={3} // Reduce the number of ticks
                        tickFormat={d => d.toFixed(2)} // Show raw accuracy (e.g., 0.10, 0.50)
                        tickLength={5}
                        stroke="none"
                        tickStroke="#333"
                        tickLabelProps={() => ({
                            fill: "#333",
                            fontSize: 10,
                            textAnchor: "end",
                            dx: -3,
                            dy: "0.33em",
                        })}
                    />
                    {/* X-Axis Label */}
                    <text
                        x={width / 2}
                        y={height + 25}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#333"
                    >
                        Epoch
                    </text>
                    {/* Y-Axis Label */}
                    <text
                        x={-(height / 2)}
                        y={8}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#333"
                        transform={`rotate(-90)`}
                    >
                        Accuracy
                    </text>
                </svg>
            </div>
            <div className="reportAccuracy">
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "bold", color: "#333", fontSize: "0.7em"}}>Model Prediction Accuracy</div>
                    <div style={{ fontWeight: "normal", color: "#999",  fontSize: "0.4em", marginBottom: "0px"}}>Higher is better</div>
                    <p className="graphText" style={{ color: getAccuracyColor(), margin: 0 }}>
                        {accuracy.toFixed(2)}%
                    </p>
                </div>
            </div>
        </div>
    );
});

export default Report;