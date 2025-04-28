/* dataset-defaults.js
 *
 * AUTHOR(S): Samuel Barney, Justin Moua
 *
 * PURPOSE: This file contains the default values for the input and output layers
 * of the neural network model for each dataset. This is necessary because different
 * datasets may require different input shapes, output shapes, loss functions, and
 * activation functions. This file is used primarily in the model.js file.
 * 
 * NOTES: For each dataset the following parameters are used:
 * Required: inputShape
 * Optional: outputShape, loss, lastLayerActivation, optimizer
 * 
 */

import irisGraph from "../assets/iris_dataset.png";
import weatherGraph from "../assets/weather_dataset.png";
import healthGraph from "../assets/health_dataset.png";
import moonsGraph from "../assets/moons_dataset.png";
import spiralGraph from "../assets/spiral_dataset.png";

export const datasetDefaults = {
    "iris_dataset.csv": {
        inputShape: [2],
        outputShape: [3],
        loss: "sparseCategoricalCrossentropy",
        lastLayerActivation: "softmax",
        inputs: ["Petal Length","Petal Width"],
        outputs: ["Iris-setosa","Iris-versicolor","Iris-virginica"],
        datasetLabel: "Iris Flower Species Identification",
        description: "Predict the species of iris flower based on petal length and width.",
        graph: irisGraph
    },
    "weather_dataset.csv": {
        inputShape: [3],
        outputShape: [3],
        loss: "sparseCategoricalCrossentropy",
        lastLayerActivation: "softmax",
        inputs: ["Temperature", "Humidity", "Wind Speed"],
        outputs: ["Sunny","Rainy","Cloudy"],
        datasetLabel: "Weather Prediction",
        graph: weatherGraph,
    },
    "health_dataset.csv": {
        inputShape: [3],
        outputShape: [3],
        loss: "sparseCategoricalCrossentropy",
        lastLayerActivation: "softmax",
        inputs: ["Heart Rate", "Blood Pressure", "Age"],
        outputs: ["Healthy", "Monitor", "Critical"],
        datasetLabel: "Health Triage",
        description: "Predict the health status based on heart rate, blood pressure, and age.",
        graph: healthGraph,
    },
    "moons_dataset.csv": {
        inputShape: [2],
        outputShape: [1],
        loss: "binaryCrossentropy",
        lastLayerActivation: "sigmoid",
        inputs: ["Feature 1", "Feature 2"],
        outputs: ["Class 0", "Class 1"],
        datasetLabel: "Moons Dataset",
        description: "Predict the class of moons dataset based on two features.",
        graph: moonsGraph,
    },
    "spiral_dataset.csv": {
        inputShape: [2],
        outputShape: [1],
        loss: "binaryCrossentropy",
        lastLayerActivation: "sigmoid",
        inputs: ["Feature 1", "Feature 2"],
        outputs: ["Class 0", "Class 1"],
        datasetLabel: "Spiral Dataset",
        description: "Predict the class of spiral dataset based on two features.",
        graph: spiralGraph,
    },
};