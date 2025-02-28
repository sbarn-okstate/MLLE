// worker.js

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';

import { prepareModel, trainModel } from './model.js';

self.onmessage = async (event) => {
    const { func, args } = event.data;

    if (func === "prepareModel") {
        await prepareModel(args);
    }

    if (func === "trainModel") {
        await trainModel(args.xs, args.ys, self);
    }
};
