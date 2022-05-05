import * as React from "react";
import { useSelector, useDispatch } from 'react-redux'
import DefenseBoard from './defense-board';
import DataBoard from './data-board'
import PuzzleBoard from './puzzle-board'
import Modal from './modal'
import {useEffect, useState, useCallback} from "react"
import { MaxX, MaxY, TypeToShape } from "../constant"


const PuzzlePart: React.FC = (props:any) => {
    // const [blockStats, setBlockStats] = useState({
    //     1:0,
    //     2:0,
    //     3:0,
    //     4:0,
    //     5:0,
    // })
    // const [move, setMove] = useState(5)
    // useEffect(()=>{
        
    // },[blockStats])
    // const statProps = {
    //     move,
    //     setMove,
    //     blockStats,
    //     setBlockStats
    // }
    return <>
        <DataBoard
                // {...statProps}
            />
            <PuzzleBoard
                // {...statProps}
                size={{
                    x: MaxX,
                    y: MaxY,
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