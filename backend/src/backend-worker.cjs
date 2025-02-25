// backend-worker.js
const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');  // Import TensorFlow.js for Node.js
const { parentPort } = require('worker_threads');  // Import worker_threads

const { prepareModel, trainModel } = require('./model.cjs');  // Assuming model.js is in the same folder

let active_model = null;

parentPort.on('message', function(event) {
  console.log('Worker received message');
  
  const { action, data } = event;
  parentPort.postMessage(action);
  switch(action) {
    case 'prepareModel':
      active_model = prepareModel(data);
      break;
    case 'trainModel':
      //parentPort.postMessage('Received xs:', data.xs);
      //parentPort.postMessage('Received ys:', data.ys);

      if (!Array.isArray(data.xs)) {
        parentPort.postMessage('data.xs is not an array:', data.xs);
      }

      if (active_model) {
        trainModel(active_model, tf.tensor(data.xs), tf.tensor(data.ys));
      }
      break;
    default:
      parentPort.postMessage('Unknown action');
  }
});
