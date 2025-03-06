/*
Justin Moua
1. Display available datasets.
2. User will choose from available datasets.
3. Obtain information from chosen dataset.
4. Will be checked to see what model will be used for it.
*/

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js';

export async function checkTfVersion(){
    try{
        console.log("tf version:", tf.version);
    }
    catch(error){
        console.error("tfjs not imported. An error occurred: ", error.message);
    }

    try{
        const tensor = tf.tensor([1, 2, 3, 4]);
        console.log(tensor.dataSync());
    }
    catch(error){
        console.error("Could not output tensor. An error occured:", error.message)
    }
}

//Displays available Datasets
export async function getDatasets(){
    let available_datasets = ["Example Dataset 1", "Example Dataset 2", "Example Dataset 3"]
    console.log("Please select from the", available_datasets.length, "available datasets: ");

    for (let i = 0; i < available_datasets.length; i++){
        console.log(available_datasets[i]);
    }
}

//Outputs chosen dataset. May discard this in the end product.
export async function printCSV(filename) {
    const response = await fetch(`/datasets/${filename}`);
    const text = await response.text();
    console.log(text);  // CSV content as a string
    console.log(filename, "Was successfully loaded!")
}

//Obtain information about dataset. 
export async function loadCSV(){
    csvURL = '/datasets/heart.csv'

    // Loading Dataset
    //Have a problem here. Need to get tf working.
    const csvDataset = tf.data.csv(csvUrl, {
        columnConfigs:{
            target: {
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });
}
//Find a way to pass information from the dataset. 