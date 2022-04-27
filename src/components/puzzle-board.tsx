import * as React from "react";
import {useEffect, useState, useCallback, useRef} from "react"
// import puzzleGame from '../board'
import puzzleGame from './puzzleGame'
import { playSound } from '../stores/sound'
import { useSelector, useDispatch } from 'react-redux'
import { TypeToShape, Isize, BlockSize } from '../constant'

interface Iprop {
    size: Isize
    setBlockStats: Function
    blockStats: Object
    move: number,
    setMove: Function
}

const PuzzleBoard = (props:Iprop) => {
    const {
        size,
        setBlockStats,
        blockStats,
        move,
        setMove,
    } = props
    const dispatch = useDispatch()
    const blockStatsRef = useRef(null);
    const moveRef = useRef(null);
    
    useEffect(()=>{
        blockStatsRef.current=blockStats
        moveRef.current=move
    },[move, blockStats])
    
    let accumulateSum = 0
    const calculateScore = ({RemovedBlockCount, ComboCount})=>{
        let score = 0
        let removedSum = 0
        if (ComboCount<1){
            accumulateSum = 0
        }
        const newBlockStats = Object.keys(blockStatsRef.current).reduce((acc: Object, key)=>{
            if (RemovedBlockCount[key]){
                const singleBlockScore = blockStatsRef.current[key]
                removedSum+=RemovedBlockCount[key]
                return {
                    ...acc,
                    [key]: singleBlockScore + RemovedBlockCount[key]
                }
            } else {
                return acc
            }
        },blockStatsRef.current)
        
        score = removedSum
        accumulateSum+=removedSum

        setBlockStats(newBlockStats)
        
        if (removedSum>10){
            setMove(move+1)
        }
        if (removedSum>5){
            score = score*2
        }
        console.log('calculateScore - RemovedBlockCount', RemovedBlockCount, 'removedSum', removedSum, 'ComboCount', ComboCount, 'accumulateSum', accumulateSum, 'score', score)
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
        TypeToShape
    }
    useEffect(() => {
        dispatch(playSound('wakeup'))
        const game = puzzleGame(puzzleOption)
        game.gameStart()
        dispatch(playSound('myang'))
    },[]);

    const boardWidth = `${size.x*BlockSize}px`
    const boardHeight = `${size.y*BlockSize}px`
    const messageHeight = `${size.y*BlockSize}px`
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