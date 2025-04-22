// Dense Layer Object
export function DenseLayerObject({ name, ref, handleRef, classNameOverride = "draggable", text = "placeholder" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "#4CAF50", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Dense Layer</p>
            </div>
            <p className={"nodeText"}>Number of Nodes: 
                <span>
                    <input
                        type="number"
                        name={name + "units"}
                        id={name + "units"}
                        min="1"
                        max="16"
                        defaultValue="2"
                        style={{ width: "60px" }}
                    />
                </span>
            </p>
        </div>
    );
};


//================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================================ACTIVATION OBJECTS START HERE================

export function ReluObject({ name, ref, handleRef, classNameOverride = "draggable",  linkStates = {}  }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                ReLu
            </p>
            

            {renderLinkIndicators(linkStates)}
        </div>
    );
}

export function SigmoidObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Sigmoid
            </p>
        </div>
    );
}

export function TanhObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Tanh
            </p>
        </div>
    );
}

export function SoftmaxObject({ name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(76, 179, 247)", // Optional: Add a background color
            }}
            >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Activation Layer</p>
            </div>
            <p className={"nodeText"}>
                Softmax
            </p>
        </div>
    );
}
//================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================================ACTIVATION OBJECTS ENDS HERE================




//================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================================CONVOLUTION OBJECTS START HERE================
// // Convolution Layer Object
export function ConvolutionLayerObject({filterSize, name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>{filterSize} Filter size
            </p>
        </div>
    );
};

//Convolution Layer Object
export function ConvolutionLayer3x3Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 3x3
            </p>
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer5x5Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 5x5
            </p>
        </div>
    );
};

// Convolution Layer Object
export function ConvolutionLayer7x7Object({name, ref, handleRef, classNameOverride = "draggable" }) {
    return (
        <div ref={ref} id={name} className={classNameOverride}
            style={{
                backgroundColor: "rgb(202, 102, 180)", // Optional: Add a background color
            }}
        >
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Convolution Layer</p>
            </div>
            <p className={"nodeText"}>Filter Size of 7x7
            </p>
        </div>
    );
};
//================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================================CONVOLUTION OBJECTS ENDS HERE================
