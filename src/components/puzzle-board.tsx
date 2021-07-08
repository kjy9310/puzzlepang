import * as React from "react";
import {useEffect} from "react"
// import puzzleGame from '../board'
import puzzleGame from './puzzleGame'
import { playSound } from '../stores/sound'
import { useDispatch } from 'react-redux'

export interface Isize{
    x: number,
    y: number,
    blockSize: number
}
interface Iprop {
    size: Isize
}

const PuzzleBoard = (props:Iprop) => {
    const {size} = props
    const dispatch = useDispatch()
    const calculateScore = (removedObj,comboCount)=>{

    }
    
    const puzzleOption = {
        sizeInfo:size, 
        removedBlockCallBack:calculateScore,
        checkGameOver:()=>true,
        gameOverCallBack:()=>console.log('game over!'),
        sounds:(action)=>{
            console.log('playSound triggered' )
            dispatch(playSound(action))
        }
    }
    useEffect(() => {
        dispatch(playSound('wakeup'))
        const game = puzzleGame(puzzleOption)
        game.gameStart()
        dispatch(playSound('myang'))
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
            <button onClick={()=>{document.getElementById("game-board").innerHTML="";const game =puzzleGame(puzzleOption);game.gameStart()}}>reset</button>
            <div id="score-scroll"></div>
        </>
    )
}

export default PuzzleBoard;