// worker.js
const { parentPort } = require('worker_threads');
const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');
parentPort.on('message', (data) => {
    console.log(`Worker received: ${data}`);
    
    // Simulate processing (e.g., compute something)
    const result = `Processed: ${data}`;

    // Send the result back to the main thread
    parentPort.postMessage(result);
});
