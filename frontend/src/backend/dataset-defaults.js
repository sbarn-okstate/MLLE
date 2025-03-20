/* dataset-defaults.js
 *
 * AUTHOR(S): Samuel Barney
 *
 * PURPOSE: This file contains the default values for the input and output layers
 * of the neural network model for each dataset. This is necessary because different
 * datasets may require different input shapes, output shapes, loss functions, and
 * activation functions. This file is used primarily in the model.js file.
 * 
 * NOTES: For each dataset the following parameters are used:
 * Required: inputShape
 * Optional: outputShape, loss, lastLayerActivation, optimizer
 * 
 */


export const datasetDefaults = {
    "synthetic_normal_binary_classification_500.csv": {
        inputShape: [2],
        outputShape: [1],
        loss: "binaryCrossentropy",
        lastLayerActivation: "sigmoid"
    }
}