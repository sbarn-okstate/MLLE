// backend-worker.js
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
console.log('TensorFlow.js module:', tf);
console.log('TensorFlow.js version:', tf?.version);
console.log('tf.tensor exists:', typeof tf.tensor);

import { prepareModel, trainModel } from './model.js';

let active_model = null

onmessage = function(event) {
    const { action, data } = event.data;
    switch(action){
      case 'prepareModel':
        active_model = prepareModel(data);
        break;
      case 'trainModel':
        if (active_model) {
          trainModel(active_model, tf.tensor(data.xs), tf.tensor(data.ys));
        }
        break;
      default:
        this.postMessage('Unknown action');
    }
  };

