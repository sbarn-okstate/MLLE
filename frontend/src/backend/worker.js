// worker.js

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel } from './model.js';
import * as dataloader from '../backend/dataloader.js' //Added by Justin.

let csvDataset; //Will probably need this here so webworker can make use of the dataset. Need to have dataloader return something to it.
self.onmessage = async (event) => {
    const { func, args } = event.data;

    if (func === "prepareModel") {
        await prepareModel(args, self);
    }

    if (func === "trainModel") {
        await trainModel(args.fileName, args.problemType, self);
    }
    if (func === "chooseDataset"){
        //args is a 1x2 array [file name, problem type]
        //await dataloader.checkTfVersion();
        
        //Currently loads dataset. 
        //Ideally this would pop up a variety of datasets
        //for the user to choose from which csvDataset would
        //store.
        csvDataset = await dataloader.loadCSV(args);

        //converts features and labels to tensors.
        await dataloader.toTensor(csvDataset);

        console.log("worker.js:",csvDataset);
    }
};
