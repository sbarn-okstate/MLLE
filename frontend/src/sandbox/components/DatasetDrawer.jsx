import { useState, useRef, useEffect } from "react";
import PlainDraggable from "plain-draggable";
import "./DatasetDrawer.css";
import {
    DatasetNBC500Object,
    DatasetHeartPredictionObject,
    DatasetBostonHousingObject,
} from "./LayerObjects.jsx";

export default function DatasetDrawer({ drawerOpen, setDrawerOpen, stageRef}) {
    const [drawerCollapse, setDrawerCollapse] = useState("drawerDivCollapsed");
    const [handleText, setHandleText] = useState("→");
    const drawerRef = useRef(null);
    const draggableRefs = useRef([]); // Store references to draggable nodes

    function toggleDrawer() {
        if (drawerOpen === false) {
            setDrawerCollapse("drawerDiv");
            setHandleText("←");
        } else {
            setDrawerCollapse("drawerDivCollapsed");
            setHandleText("→");
        }

        setDrawerOpen(!drawerOpen);
    }

    // Initialize draggable nodes when the component mounts
    useEffect(() => {
        if (drawerRef.current && stageRef.current) {
            const nodes = drawerRef.current.querySelectorAll(".drawerNode");
            nodes.forEach((node, index) => {
                console.log(stageRef.current);
                // Move the node to the stage as its parent
                stageRef.current.appendChild(node);

                // Initialize PlainDraggable with the stage as the parent
                const draggable = new PlainDraggable(node, { containment: stageRef.current });
                draggableRefs.current[index] = draggable;

                // Optional: Add drag end behavior
                draggable.onDragEnd = () => {
                    console.log(`Dragged node ${index} to position:`, draggable.position);
                };
            });
        }

        // Cleanup on unmount
        return () => {
            draggableRefs.current.forEach((draggable) => {
                if (draggable) draggable.remove();
            });
        };
    }, [drawerRef, stageRef]);

    return (
        <>
            <div className={drawerCollapse} ref={drawerRef}>
                <div className="nodeDrawer">
                    {/* Dataset Draggables */}
                    <DatasetNBC500Object classNameOverride={"drawerNode"} />
                    
                    <DatasetHeartPredictionObject classNameOverride={"drawerNode"} />

                    <DatasetBostonHousingObject classNameOverride={"drawerNode"} />
                </div>
                <div
                    className="nodeDrawerHandle"
                    tabIndex="0"
                    onClick={toggleDrawer}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") toggleDrawer();
                    }}
                >
                    <p style={{ color: "white", textAlign: "center", userSelect: "none" }}>{handleText}</p>
                </div>
            </div>
        </>
    );
}