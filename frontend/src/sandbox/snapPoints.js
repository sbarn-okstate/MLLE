const snapPoints = {
    dense: [
        { xOffset: 0, yOffset: 0.5 }, // Left-center
        { xOffset: 1, yOffset: 0.5 }, // Right-center
    ],
    dropout: [
        { xOffset: 0, yOffset: 0.5 }, // Left-center
        { xOffset: 1, yOffset: 0.5 }, // Right-center
    ],
    input: [
        { xOffset: 1, yOffset: 0.5 }, // Top-center
    ],
    output: [
        { xOffset: 0, yOffset: 0.5 }, // Bottom-center
    ],
    activation: [
        { xOffset: 0, yOffset: 0.5 }, // Left-center
        { xOffset: 1, yOffset: 0.5 }, // Right-center
    ],
    conv2d: [
        { xOffset: 0, yOffset: 0.5 }, // Left-center
        { xOffset: 1, yOffset: 0.5 }, // Right-center
    ]
};

export default snapPoints;