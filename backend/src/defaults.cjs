// defaults.js

const DENSE = {
    type: 'dense',
    units: 1,
    activation: 'relu'
};

const CONV = {
    type: 'conv',
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    inputShape: null
};

const DROPOUT = {
    type: 'dropout',
    rate: 0.2
};

const COMPILE = {
    loss: 'meanSquaredError',
    optimizer: 'adam'
};

module.exports = {
    DENSE,
    CONV,
    DROPOUT,
    COMPILE
};