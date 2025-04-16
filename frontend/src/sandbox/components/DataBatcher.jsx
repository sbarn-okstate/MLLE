export default function DataBatcher({ref, handleRef, name, classNameOverride}) {
    return (
        <div ref={ref} id={name} className={"draggable"}>
            <div ref={handleRef} className="nodeHandle">
                <p className="nodeDragText">Data Batcher</p>
            </div>
        </div>
    )
}