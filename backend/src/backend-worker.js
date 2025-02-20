// backend-worker.js
const tf = require('@tensorflow/tfjs-node');  // Import TensorFlow.js for Node.js
const { parentPort } = require('worker_threads');  // Import worker_threads

console.log('TensorFlow.js module:', tf);
console.log('TensorFlow.js version:', tf.version);
console.log('tf.tensor exists:', typeof tf.tensor);

const { prepareModel, trainModel } = require('./model.js');  // Assuming model.js is in the same folder

let active_model = null;

parentPort.on('message', function(event) {
  console.log('Worker received message');
  const { action, data } = event.data;

  switch(action) {
    case 'prepareModel':
      active_model = prepareModel(data);
      break;
    case 'trainModel':
      console.log('Received xs:', data.xs);
      console.log('Received ys:', data.ys);

      if (!Array.isArray(data.xs)) {
        console.error('data.xs is not an array:', data.xs);
      }

      if (active_model) {
        trainModel(active_model, tf.tensor(data.xs), tf.tensor(data.ys));
      }
      break;
    default:
      parentPort.postMessage('Unknown action');
  }
});
