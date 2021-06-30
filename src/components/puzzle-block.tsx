import * as React from "react";
import {useEffect, useState, useRef} from "react"

const typeToShapeClass = {
    1:"first",
    2:"second",
    3:"third",
    4:"forth",
    5:"fifth",
}

export interface Iblock {
    x: number,
    y: number,
    prevY?: number,
    type: number,
    isPopped: boolean,
    baseClass: string,
    blockOnClick: any;
    key: string
}

interface Iprops {
    blockInfo: Iblock;
    sizeY: number;
}


const Block = (props:Iprops) => {
    const {x,y, type, baseClass, blockOnClick, isPopped, key, prevY} = props.blockInfo
    const computedClassName = `${baseClass} ${typeToShapeClass[type]} ${isPopped&&" deleted"}`
    const [height, setHeight] = useState(prevY===undefined?(-props.sizeY-y-1):(props.sizeY-(prevY)-1))
    useEffect(() => {
        if (prevY!==y){
            setHeight(prevY!==undefined?(props.sizeY-(prevY)-1):(-props.sizeY-y-1))
            setTimeout(()=>{
                setHeight(props.sizeY-y-1)
            }, 1000)
        }
    },[props.blockInfo])
    return (
        <div
            key={key}
            id={key}
            className={computedClassName}
            style={{
                left: `${x*50}px`,
                top: `${height*50}px`,
                
                // borderColor:isPopped?"magenta":""
            }}
            onClick={x>-1 && y>-1 && blockOnClick}
            >
		</div>
    )
}

export default Block;