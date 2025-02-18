// backend-worker.js

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
          trainModel(active_model, data[0], [1]);
        }
        break;
      default:
        this.postMessage('Unknown action');
    }
  };

