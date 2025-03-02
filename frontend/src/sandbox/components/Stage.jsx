import TestDiv from './TestDiv.jsx';

export default function Stage({elements, drags, setDrags, updateDrags}) {
    return(
        <div id="stage" className="teststage">
            {
                elements.map(item => {
                    // TODO: Research the importance of the key prop
                    let div = <TestDiv key={item.name} name={item.name}/>
                    
                    return(div)
                    
                })
            }
        </div>
    );
}