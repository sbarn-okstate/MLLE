// defaults.js

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
    loss: 'meanSquaredError',
    optimizer: 'adam'
};