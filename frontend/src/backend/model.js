// model.js

import * as defaults from './defaults.js'

let model = null;
let sharedBuffer = null;
let weightArray = null;
let layerSizes = []; // Stores offsets for each layer's weights

let data = null;

export async function prepareModel(layers, self) {
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

    self.postMessage('Model prepared... creating shared buffer.');
    initSharedBuffer();
    self.postMessage('Shared buffer created.');
}


export async function trainModel(fileName, problemType, worker) {
    try {
        if (!model) {
            self.postMessage('Model not prepared. Please prepare model before training.');
            return;
        }
        
        self.postMessage('Preparing dataset...');
        let csvDataset = await loadCSV(fileName);
        let processedDataset = csvDataset
        .map(({ xs, ys }) => ({
            xs: Object.values(xs),
            ys: Object.values(ys)
        }))
        .batch(32)
        .shuffle(100);

        self.postMessage("Dataset processed, training...");

        await tf.ready();  // Ensure TensorFlow.js is initialized

        // Train the model lazily using the processed dataset
        await model.fit(processedDataset, {
            epochs: 500,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    worker.postMessage(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
                    saveWeightsToSharedMemory();
                }
            }
        });
  
        worker.postMessage('Training complete!');
    } catch (error) {
        worker.postMessage(`Error during training: ${error.message}`);
    }
  }


function initSharedBuffer(){
    const bufferSize = calculateBufferSize();
    sharedBuffer = new SharedArrayBuffer(bufferSize);
    weightArray = new Float32Array(sharedBuffer);
}

function calculateBufferSize() {
    let totalParams = 0;
    layerSizes = model.layers.map(layer => {
        let layerParams = layer.getWeights().reduce((sum, tensor) => sum + tensor.size, 0);
        totalParams += layerParams;
        return layerParams;
    });

    return totalParams * 4; // 4 bytes per float32
}

function saveWeightsToSharedMemory() {
    let offset = 0;
    model.layers.forEach((layer, layerIndex) => {
        layer.getWeights().forEach(tensor => {
            const data = tensor.dataSync();
            weightArray.set(data, offset);
            offset += data.length;
        });
    });

    postMessage({ func: "weightsUpdated" });
}


/* Justin Moua */

//Obtain information about dataset.
async function loadCSV(fileName){ //returns csvDataset.
    
    let csvUrl = `/datasets/${fileName}`; //Finds where the dataset is located. Looks in MLLE/frontend/public/datasets/${filename}.
    
    let csvDataset = tf.data.csv(csvUrl); //Here we create a CSVDataset. 
    
    const colNames = await csvDataset.columnNames(); //Grabs every column name. 
    const numOfFeatures = colNames.length - 1; //Grabs num of features. We assume last col is a label col.

    let featureNames = []; //Stores feature names
    let labelName; //Stores label name.
    //Loop until we reach the end of all available columns in our dataset. 
    for (let i = 0; i < colNames.length; i++){
        if (i != numOfFeatures){
            featureNames.push(colNames[i]);
        }
        //If we reached the label column. 
        else{
            labelName = colNames[i]
        }
    } 
    console.log("Features of", fileName, "are:", featureNames); //Displayed to console, not UI.
    console.log("Label column of", fileName,"is:", labelName); //Displayed to console, not UI.

    //reassigning csvDataset to include label column. 
    csvDataset = tf.data.csv(csvUrl,{
        columnConfigs:{
            [labelName]:{ //having the square brackets allow for us to have found a label and add our own there.
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });
    return csvDataset;
}

async function toTensor(csvdataset){
  console.log("Converting to tensor.");
  
}