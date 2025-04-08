/* backend.js
 *
 * AUTHOR(S): Samuel Barney
 *
 * PURPOSE:This is the interface for the backend worker that is used
 * in the main thread to recieve messages from the worker thread.
 * 
 * NOTES: None
 */

let backend_worker = null;
let sharedBuffer;
let weightArray;
let metricsArray; // Stores loss and accuracy
let layerSizes;

export function createBackendWorker(updateMetricsCallback) {
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
                
                switch (func){
                    case "sharedBuffer":
                        sharedBuffer = args.sharedBuffer;
                        layerSizes = args.layerSizes;

                        const weightsBufferSize = layerSizes.reduce((sum, size) => sum + size, 0) * 4; // Total size of weights in bytes
                        const metricsBufferSize = 12; // 4 bytes for epoch + 4 bytes for loss + 4 bytes for accuracy
                        weightArray = new Float32Array(sharedBuffer, 0, weightsBufferSize / 4);
                        metricsArray = new Float32Array(sharedBuffer, weightsBufferSize, metricsBufferSize / 4);
                        console.log("Shared buffer initialized.");
                        break;
                    case "weightsAndMetricsUpdated":
                        const { weights, epoch, loss, accuracy } = getWeightsAndMetrics();
                        //console.log("Epoch:", epoch, "Loss:", loss, "Accuracy:", accuracy);
                    
                        if (updateMetricsCallback) {
                            //console.log("Updating metrics callback with:", { epoch, loss, accuracy });
                            updateMetricsCallback(epoch, loss, accuracy); // Pass epoch, loss, and accuracy
                        }
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

