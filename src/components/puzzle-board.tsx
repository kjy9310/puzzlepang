import * as React from "react";
import {useEffect} from "react"
import gamelogic from '../board'

interface Isize{
    x: number,
    y: number
}
interface Iprop {
    size: Isize
}

const PuzzleBoard = (props:Iprop) => {
    const {size} = props

    useEffect(() => {
        gamelogic()
    },[]);

    const boardWidth = `${size.x}px`
    const boardHeight = `${size.y}px`
    const messageHeight = `${size.y}px`
    // x -> bottom to top
    // y -> left to right
    let Board = []

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
            <div id="cover">
                <span>
                    <span id="message" style={{lineHeight:messageHeight}}></span>
                </span>
            </div>
            <div id="score-scroll"></div>
        </>
    )
}

export default PuzzleBoard;