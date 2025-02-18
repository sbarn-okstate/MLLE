import * as tf from '../tensorflow/node_modules/@tensorflow/tfjs';

// Create a worker for the browser
async function createWorker() {
    let worker;
    
    if (typeof Worker !== 'undefined') {
        worker = new Worker('backend-worker.js', { type: 'module' }); // Use ES modules in the worker
    } else {
        console.error("Web Workers are not supported in this environment.");
        return;
    }
    
    return worker;
}  

export async function startTraining() {
    const worker = await createWorker();

    if (!worker) {
        console.error("Failed to create worker.");
        return;
    }

    const xs = tf.tensor2d([[1], [2], [3], [4], [5]], [5, 1]); // Input data
    const ys = tf.tensor2d([[1], [3], [5], [7], [9]], [5, 1]); // Expected output (linear pattern)

    let test_model = [
        {
            type: "dense",
            units: 128,
            activation: "relu"
        },
        {
            type: "dropout",
            rate: 0.2
        },
        {
            type: "dense",
            units: 64,
            activation: "relu"
        },
        {
            type: "dense",
            units: 32,
            activation: "relu"
        },
        {
            type: "dense",
            units: 1,
        }
    ];

    // Send messages to the worker
    worker.postMessage({ action: "prepareModel", data: test_model });
    worker.postMessage({ action: "trainModel", data: test_model });
    
    worker.onmessage = (e) => {
        console.log(e.data);
        // Here, the UI can update with weights or other data from the worker
    };

    worker.onerror = (error) => {
        console.error('Worker Error:', error);
    };
}