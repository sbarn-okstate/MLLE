// worker.js

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel } from './model.js';
import * as dataloader from '../backend/dataloader.js' //Added by Justin.

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
        //await dataloader.printCSV(filename);
        await dataloader.loadCSV(args);
    }
};
