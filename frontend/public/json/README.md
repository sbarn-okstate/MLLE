# pretrainedModelFinder.json 
finder.json represents pretrained models in this way:

    [
        {
            "synth500csv1lyr1dn1rel": "/json/synth500csv1lyr1dn1rel.json",
            "synth500csv2lyr3dn1r1dn1rel": "/json/synth500csv2lyr3dn1rel1dn1rel.json"
        }
    ]

- synth500csv1lyr1dn1rel = synthetic_normal_binary_classification_500.csv + 1 layer + 1 dense neuron in first layer + 1 relu activation function in first layer
- synth500csv2lyr3dn1rel1dn1rel = synthetic_normal_binary_classificiation_500.csv + 2 layers + 3 dense neurons in first layer + 1 relu activation function in first layer + 1 dense neuron in second layer + 1 relu activation function in second layer

# pretrained models

The serialized models are formatted as shown below.
It has been set up so that within the array (as shown by the outer brackets) can contain multiple models. This example contains one model. A higher overview of what having multiple models would look like could be this exapmle that holds three models: [{...},{...},{...}]
            

    [
        {
            "chainofObjects":[
                {
                    "dataset": "example.csv",
                    "type": "dataset"
                },
                {
                    "activation": "sigmoid",
                    "type": "dense",
                    "units: 1
                }
            ],
            "trainingMetrics": [
                {
                    "accuracy": 0.245,
                    "epoch": 1,
                    "loss": 0.694,
                    "weight": {
                        "0": -0.4313853085041046,
                        "1": -0.6370470523834229,
                        "2": -0.129189595580101,
                        "3": 1.5476932525634766,
                        "4": -0.0021780419629067183
                    }
                },
                .
                .
                .
                {
                    "accuracy": 0.479,
                    "epoch": 20,
                    "loss": 0.6932,
                    "weight": {
                        "0": -0.4313853085041046,
                        "1": -0.6370470523834229,
                        "2": -0.129189595580101,
                        "3": 1.5476932525634766,
                        "4": -0.0021780419629067183
                    }
                }
            ]
        }
    ]