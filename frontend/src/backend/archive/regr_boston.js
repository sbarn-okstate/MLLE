const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');
const path = require('path');
//const csvPath = path.resolve('./Datasets/regression datasets/preprocessed_car_price_dataset.csv');
const csvPath = path.resolve('./Datasets/regression datasets/Boston.csv');
const csvUrl = `file://${csvPath}`; // Convert to file URL

// Loading Dataset
const csvDataset = tf.data.csv(csvUrl, {
    columnConfigs:{
        medv: { isLabel: true }
    },
    hasHeader: true,
    delimiter: ','
});

//Dataset preprocessing. 
async function processDataset(){
    // Get column names (features and label)
    const columnNames = await csvDataset.columnNames();
    const labelName = 'medv'; // Label name
    const featureNames = columnNames.filter(name => name !== labelName); // Exclude the label from features


    // Number of features is the number of column names minus one for the label column.
    const numOfFeatures = featureNames.length;

    // Convert dataset to array
    const dataArray = await csvDataset.toArray();

    // Extract features and labels separately
    const xs = dataArray.map(row => featureNames.map(f => row.xs[f])); // Extract features
    const ys = dataArray.map(row => row.ys.medv); // Extract labels

    // Convert to tensors
    const xTensor = tf.tensor2d(xs);
    const yTensor = tf.tensor2d(ys, [ys.length, 1]);

    // Print tensors
    ///xTensor.print();
    yTensor.print();
    console.log("Number of features:", numOfFeatures)
    console.log("Features Names:", featureNames);
    console.log("Label Name:", labelName)
    return {xTensor, yTensor};
}

// Train the model
async function trainModel(model, xTensor, yTensor) {
    // Train the model and log the loss during training
    await model.fit(xTensor, yTensor, {
        epochs: 500,  //Hyperparam
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                // if (epoch === 0 || (epoch+1)%100 === 0){
                //     console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
                // }
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`)
            }
        }
    });

    console.log('Training complete!');
}

async function prediction(model, input){
    console.log("Inputted Data", input);
    const result = model.predict(tf.tensor2d([input]));
    return result.print()
}

async function main(){
    const {xTensor, yTensor} = await processDataset();

    //This is our model
    const model = tf.sequential({
        layers: [
          tf.layers.dense({inputShape: [13], units: 32, activation: 'linear'}),
          tf.layers.dense({units: 32, activation: 'linear'}),
          tf.layers.dense({units: 16, activation: 'linear'}),
          tf.layers.dense({units: 8, activation: 'linear'}),
          tf.layers.dense({units: 1, activation: 'linear'})
        ]
    });
    model.compile({loss: 'meanSquaredError', optimizer: tf.train.adam(0.001)})
    
    await trainModel(model, xTensor, yTensor);

    //Predicting with random values.
    console.log("")
    console.log(await prediction(model, [0.00632,18,2.31,0,0.538,6.575,65.2,4.09,1,296,15.3,396.9,4.98]))

}

main();