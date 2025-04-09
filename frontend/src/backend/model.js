/* model.js
 *
 * AUTHOR(S): Samuel Barney, Justin Moua
 *
 * PURPOSE: FIXME
 * 
 * NOTES: FIXME->prepareModel and trainModel use different argument names for the dataset filename
 */

import * as defaults from './defaults.js'
import { datasetDefaults } from './dataset-defaults.js';
import { data } from 'react-router';

let model = null;
let sharedBuffer = null;
let weightArray = null;
let metricsArray = null; // Stores loss and accuracy
let layerSizes = []; // Stores offsets for each layer's weights
let pauseResumeCallback;

export async function prepareModel({layers, dataset}, self) {
    await tf.ready();  // ensure TensorFlow.js is initialized
    model = tf.sequential();

    // add input layer
    model.add(tf.layers.inputLayer({ inputShape: datasetDefaults[dataset].inputShape }));

    // construct model based on layers argument
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
            activation: layer.activation || defaults.CONV.activation
        }));
        }
        if (layer.type === 'dropout') {
        model.add(tf.layers.dropout({
            rate: layer.rate || defaults.DROPOUT.rate
        }));
        }
    }

    // add output layer
    model.add(tf.layers.dense({
        units:      datasetDefaults[dataset].outputShape[0]      || defaults.OUTPUT.units,
        activation: datasetDefaults[dataset].lastLayerActivation || defaults.OUTPUT.activation
    }));

    // define loss and optimizer
    model.compile({
        loss: undefined      || datasetDefaults[dataset].loss      || defaults.LOSS,
        optimizer: undefined || datasetDefaults[dataset].optimizer || defaults.OPTIMIZER,
        metrics: ['accuracy']
    });
    
    // Get the model summary as a string
    const modelSummary = getModelSummaryAsString(model);

    // Post the summary to the frontend

    self.postMessage(modelSummary);
    self.postMessage('Model prepared... creating shared buffer.');
    initSharedBuffer();
    self.postMessage({ func: "sharedBuffer", args: { sharedBuffer, layerSizes } });
}

export async function trainModel(fileName, problemType, self, batchSize = 64, epochs = 1000) {
    try {
        if (!model) {
            self.postMessage('Model not prepared. Please prepare model before training.');
            return;
        }

        self.postMessage('Preparing dataset...');
        let csvDataset = await loadCSV(fileName);
        let dataArray = await csvDataset.toArray();

        await tf.ready();

        tf.util.shuffle(dataArray);
        const processedDataset = dataArray.map(({ xs, ys }) => {
            return { xs: Object.values(xs), ys: Object.values(ys) };
        });

        // Separate xs and ys into two arrays
        const xsArray = processedDataset.map(d => d.xs);
        const ysArray = processedDataset.map(d => d.ys);

        // Convert xs and ys to tensors
        const xsTensor = tf.tensor2d(xsArray);
        const ysTensor = tf.tensor2d(ysArray);

        self.postMessage("Dataset processed.");

        pauseResumeCallback = new PauseResumeCallback();

        await model.fit(xsTensor, ysTensor, {
            epochs: epochs,
            batchSize: batchSize,
            callbacks: {
                onTrainingBegin: () => {
                    self.postMessage('Training started...');
                },
                onEpochEnd: (epoch, logs) => {
                    const loss = logs.loss.toFixed(4); // Format loss to 4 decimal places
                    const accuracy = logs.acc ? logs.acc.toFixed(4) : 'N/A'; // Format accuracy if available
                    //self.postMessage(`Epoch ${epoch + 1}: loss = ${loss}, accuracy = ${accuracy}`);
        
                    // Save weights, epoch, loss, and accuracy to shared memory
                    saveWeightsAndMetricsToSharedMemory(epoch + 1, loss, accuracy);
                },
                onTrainingEnd: () => {
                    self.postMessage('Training complete!');
                },
                onBatchEnd: async (batch, logs) => {
                    const batchLoss = logs.loss.toFixed(4); // Batch loss
                    const batchAccuracy = logs.acc ? logs.acc.toFixed(4) : 'N/A'; // Batch accuracy
                    //self.postMessage(`Batch ${batch + 1}: loss = ${batchLoss}, accuracy = ${batchAccuracy}`);
                    await pauseResumeCallback.onBatchEnd(batch, logs);
                },
            }
        });
    } catch (error) {
        self.postMessage(`Error during training: ${error.message}`);
    }
}

function createBatches(xsArray, ysArray, batchSize) {
    const batches = [];
    for (let i = 0; i < xsArray.length; i += batchSize) {
        const xsBatch = xsArray.slice(i, i + batchSize);
        const ysBatch = ysArray.slice(i, i + batchSize);
        batches.push({ xs: xsBatch, ys: ysBatch });
    }
    return batches;
}

export function pauseTraining() {
    if (pauseResumeCallback) {
        pauseResumeCallback.pause();
    }
}

export function resumeTraining() {
    if (pauseResumeCallback) {
        pauseResumeCallback.resume();
    }
}

export function stopTraining() {
    if (pauseResumeCallback) {
        pauseResumeCallback.stop();
    }
}

function initSharedBuffer() {
    const weightsBufferSize = calculateBufferSize(); // Size for weights
    const metricsBufferSize = 12; // 4 bytes for epoch + 4 bytes for loss + 4 bytes for accuracy
    const totalBufferSize = weightsBufferSize + metricsBufferSize;

    sharedBuffer = new SharedArrayBuffer(totalBufferSize);
    weightArray = new Float32Array(sharedBuffer, 0, weightsBufferSize / 4); // First part for weights
    metricsArray = new Float32Array(sharedBuffer, weightsBufferSize, 3); // Second part for epoch, loss, and accuracy
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

function saveWeightsAndMetricsToSharedMemory(epoch, loss, accuracy) {
    // Save weights
    let offset = 0;
    model.layers.forEach((layer) => {
        layer.getWeights().forEach((tensor) => {
            const data = tensor.dataSync();
            weightArray.set(data, offset);
            offset += data.length;
        });
    });

    // Save epoch, loss, and accuracy
    metricsArray[0] = epoch; // Save epoch
    metricsArray[1] = parseFloat(loss); // Save loss
    metricsArray[2] = parseFloat(accuracy); // Save accuracy

    // Notify the frontend that weights, loss, and accuracy have been updated
    self.postMessage({ func: "weightsAndMetricsUpdated"});
}

class PauseResumeCallback extends tf.Callback {
    constructor() {
        super();
        this.isPaused = false;
        this.isStopped = false;
    }

    async onBatchEnd(batch, logs) {
        while (this.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (this.isStopped) {
            throw new Error('Training stopped');
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        this.isStopped = true;
    }
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

function getModelSummaryAsString(model) {
    let summary = "";

    // Temporarily override console.log
    const originalConsoleLog = console.log;
    console.log = (message) => {
        summary += message + "\n"; // Append each line of the summary to the string
    };

    // Call model.summary() to capture its output
    model.summary();

    // Restore the original console.log
    console.log = originalConsoleLog;

    return summary;
}



