// model.js

import * as defaults from './defaults.js'

let model = null;

export async function prepareModel(layers) {
    await tf.ready();  // Ensure TensorFlow.js is initialized
    model = tf.sequential();
    let firstLayer = true;

    for (let layer of layers) {
        if (layer.type === 'dense') {
        model.add(tf.layers.dense({
            units:      layer.units      || defaults.DENSE.units,
            activation: layer.activation || defaults.DENSE.activation,
            inputShape: firstLayer ? (layer.inputShape) : undefined
        }));
        }
        if (layer.type === 'conv2d') {
        model.add(tf.layers.conv2d({
            filters:    layer.filters    || defaults.CONV.units,
            kernelSize: layer.kernelSize || defaults.CONV.kernalSize,
            activation: layer.activation || defaults.CONV.activation,
            inputShape: layer.inputShape || defaults.CONV.inputShape,
            inputShape: firstLayer ? (layer.inputShape) : undefined
        }));
        }
        if (layer.type === 'dropout') {
        model.add(tf.layers.dropout({
            rate: layer.rate || defaults.DROPOUT.rate
        }));
        }
        firstLayer = false;
    }

    model.compile({
        loss: undefined      || defaults.COMPILE.loss,
        optimizer: undefined || defaults.COMPILE.optimizer
    });
}


export async function trainModel(xs, ys, worker) {
    try {
        if (!model) {
            self.postMessage('Model not prepared. Please prepare model before training.');
            return;
        }
    
        await tf.ready();  // Ensure TensorFlow.js is initialized

        xs = tf.tensor2d(xs, [xs.length, 1]);
        ys = tf.tensor2d(ys, [ys.length, 1]);
    
        await model.fit(xs, ys, {
            epochs: 500,
            callbacks: {
            onEpochEnd: (epoch, logs) => {
                worker.postMessage(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
            }
            }
        });
  
        worker.postMessage('Training complete!');
    } catch (error) {
        worker.postMessage(`Error during training: ${error.message}`);
    }
  }
