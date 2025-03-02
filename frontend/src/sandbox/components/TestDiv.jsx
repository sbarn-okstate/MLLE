export default function TestDiv({name}) {
    return(
            <div id={name} className="testdraggable">
                <p>Layer type: 
                    <span>
                        <select name="type" id="layertype">
                            <option value="dense">Dense</option>
                            <option value="dropout">Dropout</option>
                        </select>
                    </span>
                </p>
            </div>
    );
}