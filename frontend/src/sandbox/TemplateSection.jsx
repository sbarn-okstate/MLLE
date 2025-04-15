import React, { useRef } from "react";

const TemplateSection = ({ onSpawnObject }) => {
    const neuronRef = useRef(null);
    const outputRef = useRef(null);

    const handleDragStart = (objectType, ref) => (event) => {
        // Get the initial position of the template object
        const rect = ref.current.getBoundingClientRect();
        const initialPosition = { x: rect.left, y: rect.top };

        // Spawn a new active object at the drag start position
        onSpawnObject(objectType, initialPosition, true);

        // Reset the template object in its original position
        setTimeout(() => {
            onSpawnObject(objectType, initialPosition, false);
        }, 0);
    };

    return (
        <div className="templateSection">
            <div
                className="templateObject"
                ref={neuronRef}
                draggable
                onDragStart={handleDragStart("neuron", neuronRef)}
            >
                Neuron
            </div>
            <div
                className="templateObject"
                ref={outputRef}
                draggable
                onDragStart={handleDragStart("output", outputRef)}
            >
                Output
            </div>
        </div>
    );
};

export default TemplateSection;