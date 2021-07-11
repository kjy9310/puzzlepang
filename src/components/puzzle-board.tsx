import * as React from "react";
import {useEffect, useState, useCallback, useRef} from "react"
// import puzzleGame from '../board'
import puzzleGame from './puzzleGame'
import { playSound } from '../stores/sound'
import { useSelector, useDispatch } from 'react-redux'

export interface Isize{
    x: number,
    y: number,
    blockSize: number
}
interface Iprop {
    size: Isize
    setBlockStats: Function
    blockStats: Object
    move: number,
    typeToShape: Object
    setMove: Function
}

const PuzzleBoard = (props:Iprop) => {
    const {
        size,
        setBlockStats,
        blockStats,
        move,
        setMove,
        typeToShape
    } = props
    const dispatch = useDispatch()
    const blockStatsRef = useRef(null);
    const moveRef = useRef(null);
    
    useEffect(()=>{
        blockStatsRef.current=blockStats
        moveRef.current=move
    },[move, blockStats])
    
    const calculateScore = ({RemovedBlockCount, ComboCount})=>{
        
        // console.log('calculateScore - blockStats', statsRef.current, 'move', move, 'RemovedBlockCount', RemovedBlockCount)
        
        const newBlockStats = Object.keys(blockStatsRef.current).reduce((acc: Object, key)=>{
            if (RemovedBlockCount[key]){
                const singleBlockScore = blockStatsRef.current[key]
                return {
                    ...acc,
                    [key]: singleBlockScore + RemovedBlockCount[key]
                }
            } else {
                return acc
            }
        },blockStatsRef.current)
        setBlockStats(newBlockStats)
    }
    
    const puzzleOption = {
        sizeInfo:size,
        moveCountRef:moveRef,
        removedBlockCallBack:calculateScore,
        checkGameOver:()=>{
            true
        },
        gameOverCallBack:()=>{
            console.log('game over!')
        },
        sounds:(action)=>{
            dispatch(playSound(action))
        },
        processStateCallBack:(processRunning)=>{
            processRunning&&setMove(moveRef.current-1)
        },
        typeToShape
    }
    useEffect(() => {
        // dispatch(playSound('wakeup'))
        const game = puzzleGame(puzzleOption)
        game.gameStart()
        // dispatch(playSound('myang'))
    },[]);

    const boardWidth = `${size.x*size.blockSize}px`
    const boardHeight = `${size.y*size.blockSize}px`
    const messageHeight = `${size.y*size.blockSize}px`
    // x -> bottom to top
    // y -> left to right
    //----- stop defence game
    // puzzle phase
    // calculation phase
    // score phase
    //----- stop defence game
    // modal? condition check 

    return (
        <>
            <div id="game">
				<div id="game-board" style={{
                    width: boardWidth,
                    height: boardHeight
                }}>
				</div>
			</div>
            {/* <div id="cover">
                <span>
                    <span id="message" style={{lineHeight:messageHeight}}></span>
                </span>
            </div> */}
            {/* <button onClick={()=>{document.getElementById("game-board").innerHTML="";const game =puzzleGame(puzzleOption);game.gameStart()}}>reset</button> */}
            <div id="score-scroll"></div>
        </>
    )
}

export default PuzzleBoard;