export default function NodeDiv({name}, {classes}) {
    console.log(`well, we got this far`);
    console.log(`crapp!` + {name} + " " + {classes});
    return(
        <>
            <div id={name} className={"nodeDiv " + {classes}}>
                <p>Layer type: 
                    <span>
                        <select name="type" id="layertype">
                            <option value="dense">Dense</option>
                            <option value="dropout">Dropout</option>
                        </select>
                    </span>
                </p>
            </div>
        </>
    );
}