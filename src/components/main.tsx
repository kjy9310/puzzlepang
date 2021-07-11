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

const Main : React.FC = (props:any) => {
	const [blockStats, setBlockStats] = useState({
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
    })
    const [move, setMove] = useState(5)
    useEffect(()=>{
        console.log('main - blockStats', blockStats)
    },[blockStats])
    const statProps = {
        move,
        setMove,
        blockStats,
        setBlockStats
    }
    return (
    <>
        <div id="inner">
            <DefenseBoard/>
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
        </div>
        <Modal/>
    </>
    )
}

export default Main;