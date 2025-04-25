/* model.js
 *
 * AUTHOR(S): Samuel Barney, Justin Moua
 *
 * PURPOSE: FIXME
 * 
 * NOTES: FIXME->prepareModel and trainModel use different argument names for the dataset filename
 *        
 * 
 * Functions: 
 *  - NEED TO UPDATE THIS - JM (4/24/2025 @ 12:54 PM)
 *  - prepareModel({layers, dataset}, self): Prepares the model for training.
 *  - trainModel(fileName, problemType, chainOfObjects, self, batchSize = 64, epochs = 200): Trains the model using the provided dataset.
 *  - pauseTraining(): Pauses the training process.
 *  - resumeTraining(): Resumes the training process.
 *  - stopTraining(): Stops the training process.    
 *  - initSharedBuffer(): Initializes the shared buffer for weights and metrics.
 *  - calculateBufferSize(): Calculates the size of the buffer needed for weights.
 *  - saveWeightsAndMetricsToSharedMemory(epoch, loss, accuracy): Saves weights and metrics to shared memory.
 *  - createBatches(xsArray, ysArray, batchSize): Creates batches of data for training.
 *  - PauseResumeCallback: A class that handles pausing and resuming the training process.
 *  - loadCSV(fileName): Loads a CSV file and returns a dataset.
 *  - getModelSummaryAsString(model): Returns the model summary as a string.
 */

import * as defaults from './defaults.js'
import { datasetDefaults } from './dataset-defaults.js';
import { data } from 'react-router';

let isSimulating; //indicates whether code is currently simulating or not.
let model = null;
let sharedBuffer = null;
let weightArray = null;
let metricsArray = null; // Stores loss and accuracy
let layerSizes = []; // Stores offsets for each layer's weights
let pauseResumeCallback;
let allWeights = []; //Created to store to json file
let allMetrics = []; //Created to store to json file

//called by createModel() in sandbox.jsx which is called by startTraining();
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

let isPaused = false; // Flag to track pause state

export function setStateOfSimulatedTraining(setState){
    isPaused = setState; //false = not paused, true = paused, null = stopped.
}

//This function is used to train models from scratch and simulate training.
//Firstly, the end-user's model's information is grabbed. 
export async function trainModel(fileName, problemType, chainOfObjects, savePretrained, self, batchSize = 64, epochs = 100) {
    let modelFinderKey = ""; //Example of modelFinderKey: synth500csv1lyr1dn1rel
    let modelFinderValue; //Value to the key in the line above.
    let lengthOfCob = chainOfObjects.length;
    let dataset = chainOfObjects[0]?.dataset; // Use optional chaining to avoid errors if chainOfObjects[0] is undefined
    let numOfLayers = lengthOfCob - 1;
    let jsonData; //information of pretrained model (if founded in code below)
    
    //Dev purposes
    // console.log("-------------------------------",
    //     "\nchainOfObjects:", chainOfObjects,
    //     "\nlengthOfCob:", lengthOfCob,
    //     "\ndataset:", dataset,
    //     "\nnumOfLayers:", numOfLayers,
    //     "\n-------------------------------"
    // );

    //=======BUILDING THE KEY TO FIND PRETRAINED MODEL======
    //Building of key: Grabs dataset name
    if (dataset === "synthetic_normal_binary_classification_500.csv") {
        modelFinderKey += "synth500csv";
    }
    //~~~~~~~~~~~~Add more datasets here if neeeded~~~~~~~~~~~~

    //Building of key: Grabs the number of dense layers.
    //For example: 3lyr
    modelFinderKey += numOfLayers + "lyr";
    
    //Building of key: Grabs information from the layers.
    //i = 1 to skip over the dataset since we already attached it to modelFinderKey.
    for (let i = 1; i < lengthOfCob; i++) {
        let type_of_layer = chainOfObjects[i]["type"];
        let neuron_count = chainOfObjects[i]["units"];
        let activation = chainOfObjects[i]["activation"];

        //Checks if we are currently on a dense layer.
        if (type_of_layer === "dense") {
            //For example: 1dn = 1 dense neuron
            modelFinderKey += neuron_count + "dn";

            //Checks for an activation function.
            if (activation === "relu"){
                modelFinderKey += "1rel";
            }
            //~~~~~~~~~~~~add more activation functions if needed~~~~~~~~~~~~
        }
    }
    
    console.log("modelFinderKey lastly is:", modelFinderKey);

    // =============CROSS CHECKING END-USER'S MODEL W/OUR PRETRAINED MODELS============
    // Fetch pretrainedModelFinder.json which acts as our "dictionary" to check if the model the user created is one of our pretrained models.
    // Refer to README.md in MLLE/frontend/public/json/README.md for more information on how it is structured.
    let finderData;
    //Try to fetch from pretrainedModelFinder.json
    try { 
        const response = await fetch('/json/pretrainedModelFinder.json'); // fetches pretrainedModelFinder.json
        if (!response.ok) {
            throw new Error(`Failed to fetch pretrainedModelFinder.json: ${response.statusText}`);
        }
        finderData = await response.json(); // Obtbain the content from pretrainedModelFinder.json
    } catch (error) {
        console.error("Error fetching or processing pretrainedModelFinder.json:", error);
    } 
    modelFinderValue = finderData[modelFinderKey]; // Find the value associated with modelFinderKey
    const pretrainedModelFilePath = modelFinderValue; //Created for ease of readability.

    //==============IF PRETRAINED MODEL EXISTS, READ FROM JSON==============
    if (pretrainedModelFilePath) {
        console.log(`SIMULATING TRAINING! pretrained model (${modelFinderKey}) FOUNDED in pretrainedModelFinder.json!`)
        isSimulating = true;
        const response = await fetch(pretrainedModelFilePath); //fetches the file path of the pretrained model.
        jsonData = await response.json(); //Deserializes the pretrained model's contents.
        prepareSimulateTrainingWithDelay(jsonData, modelFinderKey) //Prepare training.
    }
    
    //==============IF PRETRAINED MODEL DNE, TRAIN FROM SCRATCH==============
    else {
        isSimulating = false;
        console.log(`TRAINING FROM SCRATCH! pretrained model (${modelFinderKey}) NOT FOUNDED in pretrainedModelFinder.json.`);
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

        //Used to store training metrics.
        //Will be turned into a .json later.
        //The link below talks about serializing arrays
        //into jsons! https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON
        let trainingMetrics = [];

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

                    // Push the epoch data into the array
                    trainingMetrics.push({
                        epoch: epoch + 1,
                        loss: parseFloat(loss),
                        accuracy: accuracy === 'N/A' ? null : parseFloat(accuracy),
                        //weight: weightArray, //This was previously added by justin. But removing it since it is not accurately showing the CURRENT weights. Shows the previous weights.
                    });

                    //console.log(JSON.stringify(trainingMetrics));
                    //console.log("training metrics:", trainingMetrics)
                    //self.postMessage(`Epoch ${epoch + 1}: loss = ${loss}, accuracy = ${accuracy}`);
        
                    // Save weights, epoch, loss, and accuracy to shared memory
                    saveWeightsAndMetricsToSharedMemory(epoch + 1, loss, accuracy);
                    
                },
                onTrainingEnd: () => {
                    //console.log("✅ Reached onTrainingEnd callback");
                    self.postMessage("Training complete!");
                },
                onBatchEnd: async (batch, logs) => {
                    const batchLoss = logs.loss.toFixed(4); // Batch loss
                    const batchAccuracy = logs.acc ? logs.acc.toFixed(4) : 'N/A'; // Batch accuracy
                    //self.postMessage(`Batch ${batch + 1}: loss = ${batchLoss}, accuracy = ${batchAccuracy}`);
                    await pauseResumeCallback.onBatchEnd(batch, logs);
                },
            }
        });
        console.log("savePretrained in model.js is:", savePretrained);
        if (savePretrained === true) {
            // Call to capture training
            let modelInfo = [{ chainOfObjects, allMetrics, allWeights }];
            console.log("modelInfo:", modelInfo);
            //Serialize data to JSON
            //const serializedData = JSON.stringify(modelInfo, null, 2); // Pretty-print JSON
            const serializedData = JSON.stringify(modelInfo); // No pretty print
            
            //Used for downloading the serialized data as a .JSON.
            const blob = new Blob([serializedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            //Have to pass the file name and url to mainthread!
            //https://stackoverflow.com/questions/36436075/is-it-possible-to-save-a-file-directly-from-a-web-worker
            //https://www.w3schools.com/Html/html5_webworkers.asp#:~:text=Since%20web%20workers%20are%20in,The%20document%20object
            self.postMessage({ func: "captureTraining", args: {fileName: (modelFinderKey+".json"), url} });
        
        }

        console.log("🚀 model.fit completed without error");
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
    else{
        //pauseSimulatedTraining();
        setStateOfSimulatedTraining(true)
        console.log("Paused simulated training");
    }
}

export function resumeTraining() {
    if (pauseResumeCallback) {
        pauseResumeCallback.resume();
    }
    else{
        //resumeSimulatedTraining();
        setStateOfSimulatedTraining(false)
        console.log("Resumed simulated training.")
    }
}

export function stopTraining() {
    if (pauseResumeCallback) {
        pauseResumeCallback.stop();
    }
    else {
        setStateOfSimulatedTraining(null);
        console.log("Stopped simulated training.")
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

//weightsFromPreTrained is null when training from scratch.
function saveWeightsAndMetricsToSharedMemory(epoch, loss, accuracy, weightsFromPretrained) {
    // console.log("model is:", model)
    // console.log("epoch number:", epoch);
    // console.log("loss:", loss);
    // console.log("accuracy:", accuracy);
    // Save weights

    //FIXME 4/24/2025 Justin Moua - simulated training puts epoch, loss, and accuracy into shared buffer. 
    //BUT it does not do that for the weights.
    let offset = 0;
    if (isSimulating == false) {
        model.layers.forEach((layer) => {
            layer.getWeights().forEach((tensor) => {
                const data = tensor.dataSync();
                weightArray.set(data, offset);
                offset += data.length;
            });
        });   
    }
    //pushes simulated weights into weight array shared buffer. 
    else if (isSimulating == true) {
        const data = weightsFromPretrained;
        weightArray.set(data, offset)
        offset += data.length;
        //console.log("weightArray while simulating training is:", weightArray);
    }

    // Save epoch, loss, and accuracy into metricsArray which is in the sharedbuffer.
    metricsArray[0] = epoch; // Save epoch
    metricsArray[1] = parseFloat(loss); // Save loss
    metricsArray[2] = parseFloat(accuracy); // Save accuracy

    //Currently, the code below is mainly used for saving pretrained models. Although, its use is not limited to it!
    //Save snapshots of weights and metrics for current epoch.
    let currentLayerWeights = Array.from(weightArray);
    allWeights.push(currentLayerWeights) //of type array.
    allMetrics.push({
        epoch: epoch,
        loss: parseFloat(loss),
        accuracy: parseFloat(accuracy)
    });

    // Notify the frontend that weights, loss, and accuracy have been updated
    self.postMessage({ func: "weightsAndMetricsUpdated"});
}

//Reads the pretrained model's information. Does not feed into shared buffer. Sam requested to do this though. Going to look into it 4/24/2025
//Simulate training with delay and pause functionality
async function prepareSimulateTrainingWithDelay(jsonData) {
    const num_of_epochs = jsonData[0]["allMetrics"].length;

    // Arrow functions to extract data for each variable
    const getAllEpoch = (index) => jsonData[0]["allMetrics"][index]["epoch"]; //Grabs every epoch.
    const getAllLoss = (index) => jsonData[0]["allMetrics"][index]["loss"]; //Grabs every loss
    const getAllAccuracy = (index) => jsonData[0]["allMetrics"][index]["accuracy"]; //Grabs every accuracy
    const getAllWeights = (index) => jsonData[0]["allWeights"][index]; //Grabs an array of weights

    // Helper function to introduce a delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    //Goes through every epoch of the pretrained model.
    for (let i = 0; i < num_of_epochs; i++) {
        //If training has stopped
        if (isPaused == null) {
            //If we are on the 0th epoch, isPaused may have been previously set to null because a training had previously occured.
            //So, we reset isPaused to 0. Though honestly this could be done outside of this for loop. Might change it to that later - JM 4/24/2025 11:41 AM.
            if (i === 0) { //crucial to keeping code running! isPaused may be set to null when a user has stopped a previous training and tries to train again.
                isPaused = false;
            }
            //Break for loop since isPaused == null indicates the user requested to stop the training.
            else {
                isSimulating = null;
                break; 
            }
        }
        while (isPaused) {
            await delay(100); // Wait 100ms before checking again
        }
        
        //When training is running/resumed, the code below is executed.
        const currentEpoch = getAllEpoch(i); //Grabs the current epoch
        const currentLoss = getAllLoss(i); //Grabs the current loss
        const currentAccuracy = getAllAccuracy(i); //Grabs the current accuracy
        const currentWeights = getAllWeights(i); //Grabs the current weights
        saveWeightsAndMetricsToSharedMemory(currentEpoch, currentLoss, currentAccuracy, currentWeights); //Note that isSimulating will have been set to true before prepareSimulateTrainingWithDelay is called()!
        //Updates the graph on the front-end side.
        self.postMessage({ func: "simulateTrainingWithDelay", args: { currentEpoch, currentLoss, currentAccuracy, currentWeights } });

        // Wait for 500ms before the next iteration to simulate training. 
        // Can adjust number if needed.
        await delay(500);
    }
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


export function getRandomBatch(processedDataset, batchSize) {
    if (!processedDataset || processedDataset.length === 0) {
        throw new Error("Processed dataset is empty or undefined.");
    }

    // Shuffle the dataset indices
    const shuffledIndices = tf.util.createShuffledIndices(processedDataset.length);

    // Select the first `batchSize` indices
    const batchIndices = shuffledIndices.slice(0, batchSize);

    // Extract the batch data
    const xsBatch = batchIndices.map(index => processedDataset[index].xs);
    const ysBatch = batchIndices.map(index => processedDataset[index].ys);

    return { xsBatch, ysBatch };
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



