import * as React from "react";
import { useSelector, useDispatch } from 'react-redux'
import DefenseBoard from './defense-board';
import DataBoard from './data-board'
import PuzzleBoard from './puzzle-board'
import Modal from './modal'
import {useEffect, useState, useCallback} from "react"

// width
const MaxX = 7

// height
const MaxY = 7

const typeToShape = {
    1:"first",
    2:"second",
    3:"third",
    4:"forth",
    5:"fifth",
}

const PuzzlePart: React.FC = (props:any) => {
    const [blockStats, setBlockStats] = useState({
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
    })
    const [move, setMove] = useState(5)
    useEffect(()=>{
        
    },[blockStats])
    const statProps = {
        move,
        setMove,
        blockStats,
        setBlockStats
    }
    return <>
        <DataBoard
                {...statProps}
                typeToShape={typeToShape}
            />
            <PuzzleBoard
                typeToShape={typeToShape}
                {...statProps}
                size={{
                    x: MaxX,
                    y: MaxY,
                    blockSize: 50
                }}
            />
    </>
}

const Main : React.FC = (props:any) => {
    return (
    <>
        <div id="inner">
            <DefenseBoard/>
            <PuzzlePart/>
        </div>
        <Modal/>
    </>
    )
}

export default Main;