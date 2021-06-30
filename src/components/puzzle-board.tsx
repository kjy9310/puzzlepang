import * as React from "react";
import {useEffect, useState} from "react"
import gamelogic from '../board'
import Block, {Iblock} from './puzzle-block'
interface Isize{
    x: number,
    y: number,
    blockSize: number
}
interface Iprop {
    size: Isize
}
const Around = [
    {x:-1, y: -1},
    {x:0, y: -1},
    {x:1, y: -1},
    {x:-1, y: 0},
    {x:1, y: 0},
    {x:-1, y: 1},
    {x:0, y: 1},
    {x:1, y: 1},
]

// const blockOnClick = async (event) => {
//     if (!processFinished || MoveCount<1){
//         return
//     }
//     const x = parseInt(event.target.dataset.x)
//     const y = parseInt(event.target.dataset.y)
//     Sounds.Pop.play()
//     if (selected===undefined){
//         selected = Board[x][y]
//         selected.div.classList.add("selected")
//     } else if (selected === Board[x][y]) {
//         selected.div.classList.remove("selected");
//         selected=undefined
//         return
//     } else {
//         selected.div.classList.remove("selected");
//         const temp = Board[x][y]
        
//         const beforeY = selected.y
//         const beforeX = selected.x

//         temp.x = beforeX
//         temp.y = beforeY

//         Board[x][y] = selected
//         Board[x][y].x = x
//         Board[x][y].y = y

//         Board[beforeX][beforeY] = temp
        
//         selected = undefined
//         await setBlocks()
//         updateMoveCount(-1)
//         processFinished = false
//         setTimeout(()=>processing(),1100)
//     }
// }
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const blockOnClick = ()=>{}

const PuzzleBoard = (props:Iprop) => {
    const [puzzleBoard, setPuzzleBoard] = useState([])
    
    const {size} = props
    const blockSize = size.blockSize

    useEffect(() => {
        // gamelogic()
        let puzzleBoardonLoad=[]
            for (let x = 0 ; x < size.x; x++){
                puzzleBoardonLoad[x]=[]
                for (let y = size.y-1; y >= 0; y--){
                    const block: Iblock = {
                        x,
                        y,
                        type: getRandomInt(1, 6),
                        isPopped: false,
                        baseClass: 'block block-box',
                        blockOnClick,
                        key: `${x}${y}${Date.now()}`
                    }
                    puzzleBoardonLoad[x][y] = block
                }
            }
            setPuzzleBoard(puzzleBoardonLoad)
    },[]);

    const calculatePop = async () => {
        let checkingBoard = puzzleBoard

        const checkPop = async (self: Iblock, direction) => {
            const x = self.x
            const y = self.y
            
            if (direction) {
                const opposite = Around[direction]
                const {x:diffX, y:diffY} = opposite
                const checkX = (x+diffX)
                const checkY = (y+diffY)
                const checkObject = checkingBoard[checkX]&&checkingBoard[checkX][checkY]
                if (checkObject && checkObject.type === self.type) {
                    return true
                }
            }else{
                let hasPop = false
                for (let i = 0 ; i < Around.length; i++){
                    if (hasPop) continue;
                    const {x:diffX, y:diffY} = Around[i]
                    const checkX = (x+diffX)
                    const checkY = (y+diffY)
                    const checkObject = checkingBoard[checkX]&&checkingBoard[checkX][checkY]
                    if (checkObject && checkObject.type === self.type){
                        const opposite = Around[7-i]
                        const {x:diffX, y:diffY} = opposite
                        const oppCheckX = (x+diffX)
                        const oppCheckY = (y+diffY)
                        const oppositeObject = checkingBoard[oppCheckX]&&checkingBoard[oppCheckX][oppCheckY]
                        if (oppositeObject && oppositeObject.type === self.type) {
                            hasPop= true
                        } else {
                            hasPop= await checkPop(checkObject, i)
                        }
                    }
                }
                return hasPop
            }   
        }

        for (let i = 0 ; i < checkingBoard.length; i++){
            for (let j = 0 ; j < checkingBoard[i].length; j++){
                const targetBlock = checkingBoard[i][j]
                checkingBoard[i][j].isPopped = await checkPop(targetBlock,undefined) || false
            }
        }
        setPuzzleBoard([...checkingBoard])
    }
    const rearrangeBlocks = ()=>{
        let checkingBoard = puzzleBoard
        for (let i = 0 ; i < checkingBoard.length; i++){
            let newArray = []
            for (let j = 0 ; j < checkingBoard[i].length; j++){
                if (!checkingBoard[i][j]||!checkingBoard[i][j].isPopped){
                    checkingBoard[i][j].prevY=checkingBoard[i][j].y
                    checkingBoard[i][j].y=newArray.length
                    newArray.push(checkingBoard[i][j])
                }
            }
            
            for (let j= newArray.length; j<size.y;j++){
                const block: Iblock = {
                    x:i,
                    y:j,
                    type: getRandomInt(1, 6),
                    isPopped: false,
                    baseClass: 'block block-box',
                    blockOnClick,
                    key: `${i}${j}${Date.now()}`
                }
                newArray.push(block)
            }
            checkingBoard[i] = newArray
        }
        
        setPuzzleBoard([...checkingBoard])
        
    }
    useEffect(()=>{
        
    })

    const boardWidth = `${size.x*blockSize}px`
    const boardHeight = `${size.y*blockSize}px`
    const messageHeight = `${size.y*blockSize}px`
    // x -> bottom to top
    // y -> left to right
    

    //----- stop defence game
    // puzzle phase
    // calculation phase
    // score phase
    //----- stop defence game
    // modal? condition check 
    
    

    console.log('puzzleBoard ;',puzzleBoard)
    return (
        <>
            <div id="game">
				<div id="game-board" style={{
                    width: boardWidth,
                    height: boardHeight
                }}>
                    {puzzleBoard.map((xArray)=>{
                        return <>
                            {xArray.map((block)=>{
                                return <Block blockInfo={block} sizeY={size.y}/>
                            })}
                        </>
                    })}
				</div>
			</div>
            {/* <div id="cover">
                <span>
                    <span id="message" style={{lineHeight:messageHeight}}></span>
                </span>
            </div> */}
            <div id="score-scroll"></div>
            <button onClick={()=>{calculatePop(); setTimeout(()=>rearrangeBlocks(),1000)}}>calculate</button>
        </>
    )
}

export default PuzzleBoard;