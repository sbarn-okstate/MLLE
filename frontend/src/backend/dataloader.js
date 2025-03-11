/*
Justin Moua
1. Display available datasets.
2. User will choose from available datasets.
3. Obtain information from chosen dataset.
4. Will be checked to see what model will be used for it.

We have:
  - checkTfVersion()
    - Checks if tf.js is loaded.
  - loadCSV(chosenDataset)
    - returns csvDataset (of type object).
  - test()
    - For testing purposes. 
*/


export async function checkTfVersion(){
    try{
        await tf.ready()
    }
    catch(error){
        console.error("tfjs not imported. An error occurred: ", error.message);
    }

}

//Obtain information about dataset.
export async function loadCSV(chosenDataset){ //returns csvDataset.
    //chosenDataset is an array of two values. [file name, problem type]
    
    let fileName = chosenDataset.fileName;
    let problemType = chosenDataset.problemType;
    let csvUrl = `/datasets/${fileName}`; //Finds where the dataset is located. Looks in MLLE/frontend/public/datasets/${filename}.
    
    let csvDataset = tf.data.csv(csvUrl); //Here we create a CSVDataset. 
    
    const colNames = await csvDataset.columnNames(); //Grabs every column name. 
    const numOfFeatures = colNames.length - 1; //Grabs num of features. We assume last col is a label col.

    let featureNames = []; //Stores feature names
    let labelName; //Stores label name.
    //Loop until we reach the end of all available columns in our dataset. 
    for (let i = 0; i < colNames.length; i++){
        if (i != numOfFeatures){
            featureNames.push(colNames[i]);
        }
        //If we reached the label column. 
        else{
            labelName = colNames[i]
        }
    } 
    console.log("Features of", fileName, "are:", featureNames); //Displayed to console, not UI.
    console.log("Label column of", fileName,"is:", labelName); //Displayed to console, not UI.

    //reassigning csvDataset to include label column. 
    csvDataset = tf.data.csv(csvUrl,{
        columnConfigs:{
            [labelName]:{ //having the square brackets allow for us to have found a label and add our own there.
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });
    return csvDataset;
}

export async function toTensor(csvdataset){
  console.log("Converting to tensor.");
  
}
//Function used as a workbench.
export async function test(){

}


//Below are archived functions.
/*
//Test function for dynamically grabbing feature and label columns (particularly assuming last column is label column)
export async function testGrabNames(){
    //Here we assume that there is the last column is the label input. 
    const csvUrl = 'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';

    //Here we create a CSVDataset. 
    let csvDataset = tf.data.csv(csvUrl);

    //Obtain all of the names of each column of the dataset in the csv file.
    const colNames = await csvDataset.columnNames();
    const numOfFeatures = colNames.length - 1; //Obtain how many features there are.
    let featureNames = []; //Obtain the feature names. 
    let labelName; //Obtain the name of the label column. 

    for (let i = 0; i < colNames.length; i++){
      if (i != numOfFeatures){
          featureNames.push(colNames[i]);
      }
      //For when we reach the label column. 
      else{
          labelName = colNames[i]
      }
  } 
  console.log(featureNames);
  console.log(labelName);
}
*/

/*
//The below code is from a tfjs tutorial.
export async function test_tf_tutorial(){
    const csvUrl =
    'https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/boston-housing-train.csv';
    
   // We want to predict the column "medv", which represents a median value of
   // a home (in $1000s), so we mark it as a label.
    const csvDataset = tf.data.csv(
    csvUrl);

    console.log(csvDataset)

  // Number of features is the number of column names minus one for the label
  // column.
  const numOfFeatures = (await csvDataset.columnNames()).length - 1;

  // Prepare the Dataset for training.
  const flattenedDataset =
    csvDataset
    .map(({xs, ys}) =>
      {
        // Convert xs(features) and ys(labels) from object form (keyed by
        // column name) to array form.
        return {xs:Object.values(xs), ys:Object.values(ys)};
      })
    .batch(10);

  // Define the model.
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [numOfFeatures],
    units: 1
  }));
  model.compile({
    optimizer: tf.train.sgd(0.000001),
    loss: 'meanSquaredError'
  });

  // Fit the model using the prepared Dataset
  return model.fitDataset(flattenedDataset, {
    epochs: 10,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(epoch + ':' + logs.loss);
      }
    }
  });
}
*/