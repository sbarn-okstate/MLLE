export default function StartNode({ref, handleRef, name, classNameOverride}) {
    return (
        <div ref={ref} id={name} className={"draggable"}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Start</p>
            </div>
            <p className={"nodeText"}>Start here</p>
        </div>
    )
}