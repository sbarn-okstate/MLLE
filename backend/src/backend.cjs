const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');  // Import TensorFlow.js for Node.js
const { Worker } = require('worker_threads');  // Import worker_threads for Node.js
const path = require('path');  // Path module to resolve file paths

// Create a worker for Node.js using worker_threads
function createWorker() {
    return new Worker(path.resolve(__dirname, 'backend-worker.cjs'));  // Path to the worker script
}

// Start training by creating a worker and sending messages
async function startTraining() {
    const worker = createWorker();  // Create worker

    if (!worker) {
        console.error("Failed to create worker.");
        return;
    }

    const xs = tf.tensor2d([[1], [2], [3], [4], [5]], [5, 1]);  // Input data
    const ys = tf.tensor2d([[1], [3], [5], [7], [9]], [5, 1]);  // Expected output (linear pattern)

    let test_model = [
        {
            type: "dense",
            inputShape: [5],
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
    await new Promise(resolve => setTimeout(resolve, 2000));  // Delay for 2 seconds
    worker.postMessage({ action: "trainModel", data: {xs: xs.arraySync(), ys: ys.arraySync()}});

    // Handle messages from the worker
    worker.on('message', (data) => {
        console.log('Worker Message:', data);
        // Here, you can update the UI or handle the data from the worker
    });

    worker.on('error', (error) => {
        console.error('Worker Error:', error);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
}

// Call the startTraining function to begin training
startTraining();

