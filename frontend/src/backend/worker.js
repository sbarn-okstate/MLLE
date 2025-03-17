/* worker.js
 *
 * AUTHOR(S): Samuel Barney
 *
 * PURPOSE:This is the interface for the backend worker that is used
 * in the worker thread to receive messages from the main thread.
 * 
 * NOTES: None
 */

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel, pauseTraining, resumeTraining, stopTraining } from './model.js';

let csvDataset; //Will probably need this here so webworker can make use of the dataset. Need to have dataloader return something to it.
self.onmessage = async (event) => {
    const { func, args } = event.data;

    switch (func) {
        case "prepareModel":
            await prepareModel(args, self);
            break;
        case "trainModel":
            await trainModel(args.fileName, args.problemType, self);
            break;
        case "pauseTraining":
            await pauseTraining();
            break;
        case "resumeTraining":
            await resumeTraining();
            break;
        case "stopTraining":
            await stopTraining();
            break;
        default:
            console.error(`Unknown function: ${func}`);
    }
};
