const tf = require('../tensorflow/node_modules/@tensorflow/tfjs');
console.log(tf.version)
//path to heart.csv (this dataset only contains numerical values)
const path = require('path');
const csvPath = path.resolve('./Datasets/Heart Disease Dataset/heart.csv');
const csvUrl = `file://${csvPath}`; // Convert to file URL

// Loading Dataset
const csvDataset = tf.data.csv(csvUrl, {
    columnConfigs:{
        target: {
            isLabel: true
        }
    },
    hasHeader: true,
    delimiter: ','
});

//Dataset preprocessing. 
async function processDataset(){
    // Get column names (features and label)
    const columnNames = await csvDataset.columnNames();
    const labelName = 'target'; // Label name
    const featureNames = columnNames.filter(name => name !== labelName); // Exclude the label from features


    // Number of features is the number of column names minus one for the label column.
    const numOfFeatures = featureNames.length;

    // Convert dataset to array
    const dataArray = await csvDataset.toArray();

    // Extract features and labels separately
    const xs = dataArray.map(row => featureNames.map(f => row.xs[f])); // Extract features
    const ys = dataArray.map(row => row.ys.target); // Extract labels

    // Convert to tensors
    const xTensor = tf.tensor2d(xs);
    const yTensor = tf.tensor2d(ys, [ys.length, 1]);

    // Print tensors
    //xTensor.print();
    //yTensor.print();
    // console.log("Number of features:", numOfFeatures)
    // console.log("Features Names:", featureNames);
    // console.log("Label Name:", labelName)
    return {xTensor, yTensor};
}

// Train the model
async function trainModel(model, xTensor, yTensor) {
    // Train the model and log the loss during training
    await model.fit(xTensor, yTensor, {
        epochs: 10,  //Hyperparam
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch === 0 || (epoch+1)%5 === 0){
                    console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
                }
            }
        }
    });

    console.log('Training complete!');
}

// Make a prediction.
async function prediction(model, input){
    console.log("Inputted Data", input);
    const result = model.predict(tf.tensor2d([input]));

    const arr = await result.array()

    const prediction = arr[0][0] > 0.5 ? 1 : 0;

    if (prediction == 0){
        return "This person has a heart disease."
    }
    else{
        return "This person does not have a heart disease."
    }
}

async function main(){
    const {xTensor, yTensor} = await processDataset();

    //This is our model
    const model = tf.sequential({
        layers: [
          tf.layers.dense({inputShape: [13], units: 32, activation: 'relu'}),
          tf.layers.dense({units: 32, activation: 'softmax'}), //regularizing
          tf.layers.dropout({rate: 0.2}),
          tf.layers.dense({units: 16, activation: 'relu'}),
          tf.layers.dense({units: 8, activation: 'relu'}),
          tf.layers.dense({units: 1, activation: 'sigmoid'}),
        ]
    });
    model.compile({loss: 'meanSquaredError', optimizer: 'adam'})
    
    await trainModel(model, xTensor, yTensor);

    //==========Predictions==============
    //Predicting with values from the 7th example (row) from heart.csv
    console.log("")
    console.log(await prediction(model, [58,0,0,100,248,0,0,122,0,1,1,0,2]))
    
    //Predicting with random values.
    console.log("")
    const randomInput = Array.from({ length: 13 }, () => Math.random() * 100); //Giving model random input to predict. 
    console.log(await prediction(model, randomInput))
    //Saving the model (such as parameters): https://www.tensorflow.org/js/guide/save_load
    
}

main();