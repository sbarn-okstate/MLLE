/*
Justin Moua
1. Display available datasets.
2. User will choose from available datasets.
3. Obtain information from chosen dataset.
4. Will be checked to see what model will be used for it.
*/

export async function checkTfVersion(){
    try{
        await tf.ready()
    }
    catch(error){
        console.error("tfjs not imported. An error occurred: ", error.message);
    }

}

//Displays available Datasets
export async function getDatasets(){
    //test example. Must be changed later. 
    let available_datasets = ["Example Dataset 1", "Example Dataset 2", "Example Dataset 3"]
    console.log("Please select from the", available_datasets.length, "available datasets: ");

    for (let i = 0; i < available_datasets.length; i++){
        console.log(available_datasets[i]);
    }
}
export async function checkIfFileExists(filename){
    try{
        console.log("Hey")
    }
    catch(error){
        console.log(filename, "was not founded. Error: ", error)
    }
}
//Outputs chosen dataset. May discard this in the end product.
export async function printCSV(filename) {
    try{
        const response = await fetch(`/datasets/${filename}`);
        const text = await response.text();
        console.log(text);  // CSV content as a string
        console.log(filename, "Was successfully loaded!")
    }
    catch(error){
        console.log("There was an error loading ", filename, "\nThe error says:", error)
    }

}

//Obtain information about dataset. 
export async function loadCSV(filename){
    let csvUrl = `/datasets/${filename}`;

    // Loading Dataset
    const csvDataset = tf.data.csv(csvUrl, {
        columnConfigs:{
            target: {
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });

    // Get column names (features and label)
    const columnNames = await csvDataset.columnNames();
    const labelName = 'target'; // Label name
    const featureNames = columnNames.filter(name => name !== labelName); // Exclude the label from features


    // Number of features is the number of column names minus one for the label column.
    const numOfFeatures = featureNames.length;

    // Convert dataset to array
    const dataArray = await csvDataset.toArray();

    // Extract features and labels separately
    const xs = dataArray.map(row => featureNames.map(f => row.xs[f])); // Extract features
    const ys = dataArray.map(row => row.ys.target); // Extract labels

    // Convert to tensors
    const xTensor = tf.tensor2d(xs);
    const yTensor = tf.tensor2d(ys, [ys.length, 1]);

    // Print tensors
    xTensor.print();
    yTensor.print();
    console.log("Number of features:", numOfFeatures)
    console.log("Features Names:", featureNames);
    console.log("Label Name:", labelName)
}
//Find a way to pass information from the dataset. 