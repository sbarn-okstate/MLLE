// main.js
const { Worker } = require('worker_threads');
const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');

// Create a new worker thread
const worker = new Worker('./test-worker.cjs');

// Listen for messages from the worker
worker.on('message', (message) => {
    console.log(`Main received: ${message}`);
});

// Send data to the worker
worker.postMessage('Hello, Worker!');

// Handle errors
worker.on('error', (error) => {
    console.error('Worker error:', error);
});

// Handle worker exit
worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
});
