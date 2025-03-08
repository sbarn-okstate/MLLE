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
export async function displayDatasets(){
    //test example. Must be changed later. 
    let available_datasets = ["Example Dataset 1", "Example Dataset 2", "Example Dataset 3"]
    console.log("Please select from the", available_datasets.length, "available datasets: ");

    for (let i = 0; i < available_datasets.length; i++){
        console.log(available_datasets[i]);
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
//As of 3/8/2025 1:43 AM, this function should be able to dynamically
//grab the amount of feature columns of a dataset. 
//Will need to do further testing. 
//It is currently working for test(). 
export async function loadCSV(filename){
    let csvUrl = `/datasets/${filename}`;
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
            //labelName.push(colNames[i]);
            labelName = colNames[i]
        }
    } 

    //rewriting csvDataset to include label column. 
    csvDataset = tf.data.csv(csvUrl,{
        columnConfigs:{
            [labelName]:{ //having the square brackets allow for us to have found a label and add our own there.
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });
}


//Below is a workbench-like function. 
//Some of the code is borrowed from tfjs tutorials. 
//As of 1:36 Am 3/8/2025, Justin was able to dynamically read a .csv
//that would assume the last column is a label column. 
export async function test(){
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
            //labelName.push(colNames[i]);
            labelName = colNames[i]
        }
    } 

    //rewriting csvDataset to include label column. 
    csvDataset = tf.data.csv(csvUrl,{
        columnConfigs:{
            [labelName]:{ //having the square brackets allow for us to have found a label and add our own there.
                isLabel: true
            }
        },
        hasHeader: true,
        delimiter: ','
    });

    // console.log("featureNames:", featureNames);
    // console.log("labelName:", labelName);

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