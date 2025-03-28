export default function StartNode({ref, handleRef, name, classNameOverride}) {
    return (
        <div ref={ref} id={name} className={classNameOverride + " testdraggable"}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Start</p>
            </div>
            <p>Start here</p>
        </div>
    )
}