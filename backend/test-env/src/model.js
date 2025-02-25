// model.js
export async function prepareModel(layers) {
  await tf.ready();  // Ensure TensorFlow.js is initialized
  const model = tf.sequential();
  let firstLayer = true;

  for (let layer of layers) {
      if (layer.type === 'dense') {
          model.add(tf.layers.dense({
              units: layer.units || 64,
              activation: layer.activation || 'relu',
              inputShape: firstLayer ? layer.inputShape : undefined
          }));
      }
      if (layer.type === 'conv2d') {
          model.add(tf.layers.conv2d({
              filters: layer.filters || 32,
              kernelSize: layer.kernelSize || [3, 3],
              activation: layer.activation || 'relu',
              inputShape: firstLayer ? layer.inputShape : undefined
          }));
      }
      if (layer.type === 'dropout') {
          model.add(tf.layers.dropout({
              rate: layer.rate || 0.5
          }));
      }
      firstLayer = false;
  }

  model.compile({
      loss: 'meanSquaredError',
      optimizer: 'adam'
  });

  return model;
}

export async function trainModel(model, xs, ys, worker) {
  await model.fit(xs, ys, {
      epochs: 500,
      callbacks: {
          onEpochEnd: (epoch, logs) => {
              worker.postMessage(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
          }
      }
  });

  worker.postMessage('Training complete!');
}
