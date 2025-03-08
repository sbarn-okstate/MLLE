// worker.js

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel } from './model.js';
import * as dataloader from '../backend/dataloader.js' //Added by Justin.

let csvDataset; //Will probably need this here so webworker can make use of the dataset. Need to have dataloader return something to it.
self.onmessage = async (event) => {
    const { func, args } = event.data;

    if (func === "prepareModel") {
        await prepareModel(args);
    }

    if (func === "trainModel") {
        await trainModel(args.xs, args.ys, self);
    }
    if (func === "chooseDataset"){
        await dataloader.checkTfVersion();
        await dataloader.displayDatasets();
        //await dataloader.printCSV(args);
        //await dataloader.loadCSV(args);
        await dataloader.test();
        //await dataloader.test_tf_tutorial();
    }
};
