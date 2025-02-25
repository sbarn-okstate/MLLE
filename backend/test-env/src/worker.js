import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';  // Import TensorFlow from CDN

import { prepareModel, trainModel } from './model.js';  // Import model functions

self.onmessage = async (event) => {
    const { type, data } = event.data;

    if (type === "prepareModel") {
        const model = await prepareModel(data);
        self.postMessage("Model created!");
        self.model = model;  // Store model in worker for training
    }

    if (type === "trainModel") {
        if (!self.model) {
            self.postMessage("Error: Model not initialized!");
            return;
        }

        const { xs, ys } = data;
        await trainModel(self.model, xs, ys, self);
    }
};