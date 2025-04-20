/* worker.js
 *
 * AUTHOR(S): Samuel Barney, Justin Moua
 *
 * PURPOSE:This is the interface for the backend worker that is used
 * in the worker thread to receive messages from the main thread.
 * 
 * NOTES: None
 */

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel, pauseTraining, resumeTraining, stopTraining, validatePretrainedModel} from './model.js';

let csvDataset; //Will probably need this here so webworker can make use of the dataset. Need to have dataloader return something to it.

//args can consist of saveFile, fileName, problemType, and/or chainOfObjects.
self.onmessage = async (event) => {
    const { func, args } = event.data;

    switch (func) {
        case "prepareModel":
            await prepareModel(args, self);
            break;
        case "trainModel":
                                  //saveFile is for dev purposes.
            await trainModel(args.saveFile, args.fileName, args.problemType, args.chainOfObjects, self);
            break;
        case "pauseTraining":
            await pauseTraining(self);
            break;
        case "resumeTraining":
            await resumeTraining(self);
            break;
        case "stopTraining":
            await stopTraining();
            break;
        case "validatePretrainedModel":
            await validatePretrainedModel(args.model, self);
            break;
        default:
            console.error(`Unknown function: ${func}`);
    }
};
