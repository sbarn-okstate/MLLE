// backend.js

let backend_worker = null;
let sharedBuffer;
let weightArray;
let layerSizes;

export function createBackendWorker() {
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
                        weightArray = new Float32Array(sharedBuffer);
                        console.log("Shared buffer initialized.");
                        break;
                    case "weightsUpdated":
                        console.log("Weights updated:", getLayerWeights());
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
    console.log('Backend worker already created.');
}

function getLayerWeights() {
    let offset = 0;
    return layerSizes.map(layerSize => {
        const layerWeights = weightArray.slice(offset, offset + layerSize);
        offset += layerSize;
        return layerWeights; // Float32Array of this layer’s weights
    });
}


export function getBackendWorker(){
    if (!backend_worker) createBackendWorker();
    return backend_worker;
}

