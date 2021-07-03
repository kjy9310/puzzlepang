import * as React from "react";
import {useEffect, useState, useRef} from "react"
import gamelogic from '../board'
import Block, {Iblock} from './puzzle-block'
import sounds from '../sound'

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

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

const PuzzleBoard = (props:Iprop) => {
    const [puzzleBoard, setPuzzleBoard] = useState([])
    const [processing, setProcessing] = useState(false)
    // const [phase, setPhase] = useState(1) //
    // hasPop, pop, refill
    // 발동 가능상태인지 함수시작 마다 체크하기
    // state checking - 상태 단계를 만들어두기
    // 
    const [selected, setSelected] = useState(undefined)
    const prevSelected = usePrevious(selected)
    const [phase,setPhase] = useState(0)
    const blockOnClick = async (block?: Iblock) => {
        if (processing 
            // || MoveCount<1
            ){
            return false
        }
        
        sounds.Pop.play()
        setSelected(block)
        return true
    }

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

    const calculatePop = async (checkOnly=false) => {
        let checkingBoard = puzzleBoard

        const checkPop = async (self: Iblock, direction) => {
            const x = self.x
            const y = self.y
            
            if (direction) {
                const sameDirection = Around[direction]
                const {x:diffX, y:diffY} = sameDirection
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
                if (checkOnly && await checkPop(targetBlock,undefined)){
                    return true
                }else{
                    checkingBoard[i][j].isPopped = await checkPop(targetBlock,undefined) || false
                }
                
            }
        }
        if(!checkOnly){
            setPuzzleBoard([...checkingBoard])
        }
        return false
    }
    const rearrangeBlocks = async ()=>{
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
                    // prevY:j,
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
        // setTimeout(async ()=>{
            setPuzzleBoard([...checkingBoard])
            
        // },1000)
    }
    useEffect(()=>{
        if (prevSelected && selected){
            const x = selected.x
            const y = selected.y
            
            const {
                x: beforeX,
                y: beforeY
            } = prevSelected||{x:0,y:0}
            
            selected.x = beforeX
            selected.y = beforeY
            selected.exchange = true

            let checkingBoard = puzzleBoard
            checkingBoard[x][y] = prevSelected
            checkingBoard[x][y].x = x
            checkingBoard[x][y].y = y
            checkingBoard[x][y].exchange = true

            checkingBoard[beforeX][beforeY] = selected
            
            
            // updateMoveCount(-1)
            // processFinished = false
            setPuzzleBoard([...checkingBoard])
            
            setTimeout(async ()=>{
                setPhase(1)
                setSelected(undefined)
            },100)
            
        }
    },[selected])

    useEffect(()=>{
        switch(phase){
            case 1:
                setTimeout(async ()=>{
                    if(await calculatePop(true)){
                       await calculatePop()
                       setTimeout(()=>setPhase(2),1000)
                    } else {
                        setPhase(0)
                    }
                },400)
                break;
            case 2:
                setTimeout(async ()=>{
                    await rearrangeBlocks()
                    setTimeout(()=>setPhase(1),1000)
                },1000)
                break;
        }
    },[phase])
    
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
    const [testY, setTestY] = useState({
        y:10,
        prevY:undefined
    })
    const testBlock = {
        x:10,
        ...testY,
        type: getRandomInt(1, 6),
        isPopped: false,
        baseClass: 'block block-box',
        blockOnClick,
        key: `${1}${1}${Date.now()}`
    }
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
                                return <Block blockInfo={block} sizeY={size.y} isSelected={selected===block}/>
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
            {/* <button onClick={async ()=>{
                
                setTestY({
                y:5,prevY:10
            })
            setTimeout(()=>setTestY({
                y:6,
                prevY:undefined
            }),1000)
            }}>calculate</button>
            <>
            {
                puzzleBoard.map((xArray)=>{
                    return <>
                            {xArray.map((block)=>{
                                return <Block  showLog={true} blockInfo={testBlock} sizeY={size.y} isSelected={false}/>
                            })}
                        </>
                    
                })
            }
            </> */}
        </>
    )
}

export default PuzzleBoard;