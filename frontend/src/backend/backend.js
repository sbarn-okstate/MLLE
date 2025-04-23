/* backend.js
 *
 * AUTHOR(S): Samuel Barney
 *
 * PURPOSE:This is the interface for the backend worker that is used
 * in the main thread to recieve messages from the worker thread.
 * 
 * NOTES: None
 * 
 * A main thread file that is used to communicate with the worker. 
 * This is where the main thread is. 
 * Messaging posting is to go to the worker. 
 * 
 * TODO (4/10/2025 by Justin Moua): 
 * - (DONE) Put "pretrained model" (.json file of chainOfObjects and model hyperparamters)
 *   into public folder. (Before doing so, create a "JSON" folder in the public folder.) 
 * -(DONE) Validate that the model created via GUI matches up with model founded in the JSON file.
 *     - Will probably have to make loops to check through the .json file . 
 * - (NOT DONE) If the step before is successful, then read the training information
 *   and try to display it on the graph.
 */

let backend_worker = null;
let sharedBuffer;
let weightArray;
let metricsArray; // Stores loss and accuracy
let layerSizes;
let data;
let modelInfo;

//Called by Sandbox.jsx from it's createBackend() function.
//updateMetricsCallback is a function PASSED FROM Sandbox.jsx. It looks like this:
//              const updateMetricsCallback = (epoch, loss, accuracy) => {
//                  updateGraphData(epoch, accuracy); // Pass accuracy to the graph
//                  updateAccuracy(accuracy); // Update the accuracy percentage
//              }
export function createBackendWorker(updateMetricsCallback, updateWeightsCallback) {
    if (!backend_worker) {
        backend_worker = new Worker(new URL("./worker.js", import.meta.url), {type: 'module'});
        console.log("Backend worker created.");
    
        backend_worker.onmessage = (event) => {
            const message = event.data;

            if (typeof message === "string") {
                console.log("[Backend]", message);
                return;
            }

            if (typeof message === "object" && message !== null) {
                const {func, args} = message;
                
                switch (func) {
                    case "sharedBuffer":
                        sharedBuffer = args.sharedBuffer; //obtained from model.js
                        layerSizes = args.layerSizes; //obtained from model.js

                        const weightsBufferSize = layerSizes.reduce((sum, size) => sum + size, 0) * 4; // Total size of weights in bytes
                        const metricsBufferSize = 12; // 4 bytes for epoch + 4 bytes for loss + 4 bytes for accuracy
                        // Link here explains about the Float32Array() constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array/Float32Array
                        //            new Float32Array(buffer, byteOffset, length)
                        weightArray = new Float32Array(sharedBuffer, 0, weightsBufferSize / 4);
                        metricsArray = new Float32Array(sharedBuffer, weightsBufferSize, metricsBufferSize / 4);
                        console.log("Shared buffer initialized.");
                        break;
                    case "weightsAndMetricsUpdated":
                        //getWeightsAndMetrics will is called everytime weights and other metrics are updated.
                        const { weights, epoch, loss, accuracy } = getWeightsAndMetrics();
                        //console.log("Epoch:", epoch, "Loss:", loss, "Accuracy:", accuracy);
                        if (updateMetricsCallback) {
                            //console.log("Updating metrics callback with:", { epoch, loss, accuracy });
                            updateMetricsCallback(epoch, loss, accuracy, weights); // Pass epoch, loss, accuracy, and weights.
                        }
                        if (updateWeightsCallback) {
                            //console.log("Updating weights callback with:", { weights });
                            updateWeightsCallback(weights); // Pass weights
                        }
                        if (updateWeightsCallback) {
                            //console.log("Updating weights callback with:", { weights });
                            updateWeightsCallback(weights); // Pass weights
                        }
                        break;
                    //FOR DEV PURPOSES. Is only called if saveFile is set to true in Sandbox.jsx
                    //Used for saving the model to a file.
                    //This gets called from model.js in trainModel().
                    //args: { fileName: "modelInfo.json", chainOfObjects, trainingMetrics} 
                    //      - trainingMetrics contains weights, epoch, loss, and accuracy.
                    case "captureTraining":
                        let url = args.url;
                        let fileName = args.fileName;
                        
                        //All this does is create a download link, clicks it, and gets rid of it.
                        //The serialization takes place in the backend.
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        console.log("Now it should save");
                        break;
                    case "simulateTrainingWithDelay":
                        let jsonData = args.jsonData;
                        simulateTrainingWithDelay(jsonData, updateMetricsCallback);
                        break;
                    case "pauseSimulatedTraining":
                        pauseSimulatedTraining();
                        break;
                    case "resumeSimulatedTraining":
                        resumeSimulatedTraining();
                        break;

                    default:
                        console.log('Unknown function call from backend worker:', func);
                }

                return;
            }

            console.warn("Received unknown message format from backend worker:", message);
        }
        return;
    }
    //console.log('Backend worker already created.');
}

// async function simulateTrainingWithDelay(jsonData, updateMetricsCallback) {
//     const num_of_epochs = jsonData[0]["trainingMetrics"].length;

//     // Arrow functions to extract data for each variable
//     const getEpoch = (index) => jsonData[0]["trainingMetrics"][index]["epoch"];
//     const getLoss = (index) => jsonData[0]["trainingMetrics"][index]["loss"];
//     const getAccuracy = (index) => jsonData[0]["trainingMetrics"][index]["accuracy"];
//     const getWeights = (index) => jsonData[0]["trainingMetrics"][index]["weight"]; // Assuming weights are stored in a "weightsArray"

//     // Helper function to introduce a delay
//     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//     for (let i = 0; i < num_of_epochs; i++) {
//         const epoch = getEpoch(i);
//         const loss = getLoss(i);
//         const accuracy = getAccuracy(i);
//         const weights = getWeights(i);

//         if (updateMetricsCallback) {
//             updateMetricsCallback(epoch, loss, accuracy, weights); // Pass epoch, loss, accuracy, and weights
//         }

//         // Wait for 1 second before the next iteration
//         await delay(500);
//     }
// }

let isPaused = false; // Flag to track pause state

// Function to pause training
export function pauseSimulatedTraining() {
    isPaused = true;
}

// Function to resume training
export function resumeSimulatedTraining() {
    isPaused = false;
}

// Simulate training with delay and pause functionality
async function simulateTrainingWithDelay(jsonData, updateMetricsCallback) {
    const num_of_epochs = jsonData[0]["trainingMetrics"].length;

    // Arrow functions to extract data for each variable
    const getEpoch = (index) => jsonData[0]["trainingMetrics"][index]["epoch"];
    const getLoss = (index) => jsonData[0]["trainingMetrics"][index]["loss"];
    const getAccuracy = (index) => jsonData[0]["trainingMetrics"][index]["accuracy"];
    const getWeights = (index) => jsonData[0]["trainingMetrics"][index]["weight"]; // Assuming weights are stored in a "weightsArray"

    // Helper function to introduce a delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < num_of_epochs; i++) {
        // Check if paused
        while (isPaused) {
            await delay(100); // Wait 100ms before checking again
        }

        const epoch = getEpoch(i);
        const loss = getLoss(i);
        const accuracy = getAccuracy(i);
        const weights = getWeights(i);

        if (updateMetricsCallback) {
            updateMetricsCallback(epoch, loss, accuracy, weights); // Pass epoch, loss, accuracy, and weights
        }

        // Wait for 500ms before the next iteration
        await delay(500);
    }
}

function getWeightsAndMetrics() {
    let offset = 0;

    // Extract weights for each layer
    const weights = layerSizes.map(layerSize => {
        const layerWeights = weightArray.slice(offset, offset + layerSize);
        offset += layerSize;
        return layerWeights; // Float32Array of this layer’s weights
    });

    // Extract epoch, loss, and accuracy from the shared buffer
    const epoch = metricsArray[0]; // Epoch is stored first
    const loss = metricsArray[1]; // Loss is stored after the epoch
    const accuracy = metricsArray[2]; // Accuracy is stored after the loss

    return { weights, epoch, loss, accuracy };
}

export function getBackendWorker(){
    if (!backend_worker) createBackendWorker();
    return backend_worker;
}

