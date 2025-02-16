const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');

// Create a simple dataset
const xs = tf.tensor2d([[1], [2], [3], [4], [5]], [5, 1]); // Input data
const ys = tf.tensor2d([[1], [3], [5], [7], [9]], [5, 1]); // Expected output (linear pattern)

// Define a more complex sequential model
const model = tf.sequential();

// Add a dense layer with 32 units and ReLU activation
model.add(tf.layers.dense({ units: 32, inputShape: [1], activation: 'relu' }));

// Add a dropout layer for regularization
model.add(tf.layers.dropout({ rate: 0.2 }));

// Add a dense layer with 16 units and ReLU activation
model.add(tf.layers.dense({ units: 16, activation: 'relu' }));

// Add another dense layer with 8 units and ReLU activation
model.add(tf.layers.dense({ units: 8, activation: 'relu' }));

// Output layer with 1 unit (for regression, no activation function)
model.add(tf.layers.dense({ units: 1 }));

// Compile the model with meanSquaredError loss and an Adam optimizer
model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

// Train the model
async function trainModel() {
  // Train the model and log the loss during training
  await model.fit(xs, ys, {
    epochs: 500, // Number of epochs (iterations over the dataset)
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
      }
    }
  });

  console.log('Training complete!');
  
  // Use the model to make a prediction
  const result = model.predict(tf.tensor2d([[6]], [1, 1]));
  result.print(); // Print the prediction for the input [6]
}

// Call the train function
trainModel();
