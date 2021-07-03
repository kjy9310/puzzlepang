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
    key: string;
    exchange?: boolean
    
}

interface Iprops {
    blockInfo: Iblock;
    sizeY: number;
    isSelected: boolean
    showLog?: boolean
}


const Block = (props:Iprops) => {
    const {x,y, type, baseClass, blockOnClick, isPopped, key, prevY, exchange} = props.blockInfo
    const [height, setHeight] = useState((props.sizeY-prevY-1))//(-props.sizeY-y-1))
    const [movingFlag, setMoving] = useState(false)
    const [hide, setHide] = useState(true)
    const computedClassName = `${baseClass} ${typeToShapeClass[type]} ${isPopped&&" deleted"} ${props.isSelected&&'selected'} ${movingFlag&&'move'} ${hide&&'hide'}`
    useEffect(() => {
        if (!exchange&&prevY!==y){
            // setHeight((props.sizeY-(prevY)))
            // setHeight(0)
            setHide(true)
            // setTimeout(()=>{
                setHeight(prevY===undefined?(-props.sizeY-y-1):(props.sizeY-prevY-1))
                setHide(false)
                setTimeout(()=>{
                    setMoving(true)
                    setHeight(props.sizeY-y-1)
                    setTimeout(()=>{
                        setMoving(false)
                    },500)
                },500)
            // },100)
            
            
                
            
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
                // ...(movingFlag?{}:{transition: 'none'})
            }}
            onClick={()=>{
                blockOnClick(props.isSelected?undefined:props.blockInfo)
            }}
            >
		</div>
    )
}

export default Block;