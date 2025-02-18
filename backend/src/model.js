// model.js

//import * as tf from '../tensorflow/node_modules/@tensorflow/tfjs';

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import * as defaults from './defaults.js';

export async function prepareModel(layers){
    const model = tf.sequential();
    for (let layer of layers) {
      if (layer.type === 'dense') {
        model.add(tf.layers.dense({
          units:      layer.units      || defaults.DENSE.units,               
          activation: layer.activation || defaults.DENSE.activation
        }));
      }
      if (layer.type === 'conv2d') {
        model.add(tf.layers.conv2d({
          filters:    layer.filters    || defaults.CONV.units,
          kernelSize: layer.kernelSize || defaults.CONV.kernalSize,
          activation: layer.activation || defaults.CONV.activation, 
          inputShape: layer.inputShape || defaults.CONV.inputShape 
        }));
      }
      if (layer.type === 'dropout') {
        model.add(tf.layers.dropout({
          rate: layer.rate || defaults.DROPOUT.rate
        }));
      }
    }
  
    model.compile({
      loss: undefined      || defaults.COMPILE.loss,      // undefined is a placeholder
      optimizer: undefined || defaults.COMPILE.optimizer, // undefined is a placeholder
    })
  
    return model;
  }
  
export async function trainModel(model, xs, ys){
  await model.fit(xs, ys, {
    epochs: 500, // Number of epochs (iterations over the dataset)
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
      }
    }
  });

  console.log('Training complete!');
}
