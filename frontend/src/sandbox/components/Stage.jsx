import { useEffect, useRef } from "react";
import TestDiv from './TestDiv.jsx';
import PlainDraggable from "plain-draggable";

export default function Stage({elements, drags, setDrags}) {
    const divRefs = useRef([]);

    useEffect(() => {
        // This useEffect runs after the components are rendered
        divRefs.current.forEach(div => {
            if (div) {
                // Only create new PlainDraggable instances if the ref is set
                setDrags(prev => [...prev, new PlainDraggable(div)]);
            }
        });
    }, [elements, setDrags]);

    return (
        <div id="stage" className="teststage">
            {
                elements.map((item, index) => {
                    return (
                        <TestDiv 
                            key={item.name} 
                            name={item.name} 
                            ref={el => divRefs.current[index] = el} // Set ref for each TestDiv
                        />
                    );
                })
            }
        </div>
    );
}
