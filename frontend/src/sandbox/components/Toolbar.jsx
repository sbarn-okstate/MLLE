import React, { useRef } from "react";
import "./Toolbar.css";
import {
    DatasetObject,
    DatasetNBC500Object,
    DatasetHeartPredictionObject,
    DatasetBostonHousingObject,
    DatasetMNISTObject,
    DatasetFashionMNISTObject,
    DenseLayerObject,
    ActivationLayerObject,
    ConvolutionLayerObject,
    NeuronObject,
    OutputLayerObject,
    ReluObject,
    SigmoidObject,
    TanhObject,
    SoftmaxObject,
    ConvolutionLayer3x3Object,
    ConvolutionLayer5x5Object,
    ConvolutionLayer7x7Object
} from './LayerObjects.jsx';

function renderObject(objectType, subType, datasetFileName, props, objects) {
    const { key, ...restProps } = props;

    switch (objectType) {
        case "output":
            return <OutputLayerObject key={key} {...restProps}/>;
        case "neuron":
            return <NeuronObject key={key} {...restProps} />;
        default:
            return null;
    }
}

function onToolbarDragStart(id, objects) {
    objects.forEach(obj => {
        if (obj.id === id) {
            obj.isActive = true;
        }
        console.log("onToolbarDragStart", obj.id, obj.isActive);
    });
};

const Toolbar = ({objects}) => {
    const divRefs = useRef([]);
    const handleRefs = useRef([]);

    return (
        <div className="toolbar">
            {objects.filter(obj => !obj.isActive).map((item, index) =>
                <div
                    key={item.id}
                    draggable
                    onDragStart={() => onToolbarDragStart(item.id, objects)}
                    ref={el => divRefs.current[index] = el}
                    style={{ margin: "0 10px", cursor: "grab" }}
                >
                    {renderObject(
                        item.objectType,
                        item.subType,
                        item.datasetFileName,
                        {
                            key: item.id,
                            name: item.id,
                            ref: el => divRefs.current[index] = el,
                            handleRef: el => handleRefs.current[index] = el,
                        },
                        objects
                    )}
                </div>
            )}
        </div>
    );
};

export default Toolbar;