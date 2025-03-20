/* defaults.js
 *
 * AUTHOR(S): Samuel Barney
 *
 * PURPOSE: This file contains the default values for model layers
 * and model compilation.
 * 
 * NOTES: FIXME -> different datasets need different input shapes and loss functions.
 * Also we need a way to automatically make the last layer have 1 output unit and 
 * a sigmoid activation function (at least for classification problems).
 * Some of these changes should be made in the model.js file, but it may also be good to 
 * add a dataset_default.js file to handle some of these changes.
 */

export const DENSE = {
    type: 'dense',
    units: 1,
    activation: 'relu'
};

export const CONV = {
    type: 'conv',
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    inputShape: null
};

export const DROPOUT = {
    type: 'dropout',
    rate: 0.2
};

export const COMPILE = {
    loss: 'binaryCrossentropy',
    optimizer: 'adam'
};

export const LOSS = 'binaryCrossentropy';
export const OPTIMIZER = 'adam';

export const OUTPUT = {
    units: 1,
    activation: 'sigmoid'
};