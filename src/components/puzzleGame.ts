import { TypeToShape, Isize} from '../constant'


interface IOptions{
    sizeInfo:Isize
    removedBlockCallBack?: Function
    processStateCallBack?: Function
    checkGameOver?: Function
    gameOverCallBack?: Function
    sounds?: Function,
    moveCountRef: any
}

const puzzle = (Options: IOptions) =>{
    const {
        sizeInfo,
        removedBlockCallBack,
        processStateCallBack,
        checkGameOver,
        gameOverCallBack,
        sounds,
        moveCountRef
    } = Options
    
    const MaxX = sizeInfo.x
    const MaxY = sizeInfo.y

    let Board = []

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

    let selected = undefined

    globalThis.processRunning = true

    let ComboCount = 0

    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
    }

    const createBlock = (x,y, type, className) => {
        const div = document.createElement('div')
        div.className = className + " " + TypeToShape[type]
        div.style.left = `${x*50}px`
        div.style.top = `${-50*y}px`//`${x*50}px`
        div.dataset.x = x
        div.dataset.y = y
        div.onclick = x>-1 && y>-1 && blockOnClick
        document.getElementById('game-board').appendChild(div)
        return {
            x,
            y,
            type,
            div,
        }
    }

    const blockOnClick = async (event) => {
        if (globalThis.processRunning || (moveCountRef&&moveCountRef.current<1)){
            return
        }

        const x = parseInt(event.target.dataset.x)
        const y = parseInt(event.target.dataset.y)
        sounds('pop')
        if (selected===undefined){
            selected = Board[x][y]
            selected.div.classList.add("selected")
        } else if (selected === Board[x][y]) {
            selected.div.classList.remove("selected");
            selected=undefined
            return
        } else {
            const temp = Board[x][y]
            temp.div.classList.add("selected")
            const beforeY = selected.y
            const beforeX = selected.x

            temp.x = beforeX
            temp.y = beforeY

            Board[x][y] = selected
            Board[x][y].x = x
            Board[x][y].y = y

            Board[beforeX][beforeY] = temp
            
            await setBlocks()
            
            globalThis.processRunning = true
            processStateCallBack&&processStateCallBack(globalThis.processRunning)

            setTimeout(()=>{
                processing()
                selected.div.classList.remove("selected");
                temp.div.classList.remove("selected");
                selected = undefined    
            },1100)
        }
    }

    const setBlocks = () =>{
        return new Promise<void>(resolve=>{
            for (let x = 0 ; x < MaxX; x++){
                for (let y = MaxY-1; y >= 0; y--){
                    Board[x][y].div.style.top = `${(50*(MaxY-1))-50*y}px`
                    Board[x][y].div.style.left = `${50*x}px`
                    Board[x][y].div.dataset.x = x
                    Board[x][y].x = x
                    Board[x][y].div.dataset.y = y
                    Board[x][y].y = y
                }
            }
            resolve()
        })
    }

    const checkBoard = (pangCheck=false)=>new Promise(async resolve=>{
        for (let i = 0 ; i < Board.length; i++){
            for (let j = 0 ; j < Board[i].length; j++){
                const check = Board[i][j] && Board[i][j].delete !== "1" && await checkChain(Board[i][j])
                if (check){
                    if (pangCheck) {
                        resolve(true)
                    }
                    Board[i][j].delete = "1"
                }
            }
        }
        resolve(false)
    })

    const removeBlocks = () =>{
        return new Promise<void>(resolve=>{
            sounds('coins')
            let RemovedBlockCount = {}
            for (let i = 0 ; i < Board.length; i++){
                let newArray = []
                for (let j = 0 ; j < Board[i].length; j++){
                    if (Board[i][j]&&Board[i][j].delete==="1"){
                        const target = Board[i][j]
                        RemovedBlockCount[target.type]=(RemovedBlockCount[target.type]===undefined?1:(RemovedBlockCount[target.type]+1))
                        const targetNode = target.div
                        targetNode.className+=" deleted"
                        setTimeout(()=>document.getElementById('game-board').removeChild(targetNode),1000)
                    }else{
                        newArray.push(Board[i][j])
                    }
                }
                Board[i] = newArray
                for (let j= Board[i].length; j<MaxY;j++){
                    Board[i].push(createBlock(i, j, getRandomInt(1, 6), 'block block-box'))
                }
            }
            removedBlockCallBack&&removedBlockCallBack({RemovedBlockCount, ComboCount})
            resolve()
        })
    }

   
    const checkChain = async (self, direction=undefined) => {
        const x = self.x
        const y = self.y
        
        if (direction!==undefined) {
            const opposite = Around[direction]
            const {x:diffX, y:diffY} = opposite
            const checkX = (parseInt(x)+diffX)
            const checkY = (parseInt(y)+diffY)
            const checkObject = Board[checkX]&&Board[checkX][checkY]
            if (checkObject && checkObject.type === self.type) {
                return true
            } else {
                return false
            }
        }else{
            for (let i = 0 ; i < Around.length; i++){
                const {x:diffX, y:diffY} = Around[i]
                const checkX = (parseInt(x)+diffX)
                const checkY = (parseInt(y)+diffY)
                const checkObject = Board[checkX]&&Board[checkX][checkY]
                if (checkObject && checkObject.type === self.type){
                    const opposite = Around[7-i]
                    const {x:diffX, y:diffY} = opposite
                    const checkX = (parseInt(x)+diffX)
                    const checkY = (parseInt(y)+diffY)
                    const oppositeObject = Board[checkX]&&Board[checkX][checkY]
                    if (oppositeObject && oppositeObject.type === self.type) {
                        return true   
                    } else if (await checkChain(checkObject, i)===true){
                        return true
                    }
                }
            }
            return false
        }   
    }

    const processing = async () =>{
        const runProcess = await checkBoard(true)
        if (runProcess) {
            ComboCount++
            await checkBoard()
            await removeBlocks()
            await new Promise<void>(resolve=>{setTimeout(()=>resolve(),400)})
            await setBlocks()
            await new Promise<void>(resolve=>{setTimeout(()=>resolve(),1000)})
            if (checkGameOver&&checkGameOver()){
                gameOverCallBack&&gameOverCallBack()
                return
            }
            await processing()
        } 
        globalThis.processRunning = false
        processStateCallBack&&processStateCallBack(globalThis.processRunning)
        ComboCount = 0
    }

    const gameStart = () =>{
        console.log('gameStart called')
        for (let x = 0 ; x < MaxX; x++){
            Board[x]=[]
            for (let y = MaxY-1; y >= 0; y--){
                Board[x][y] = createBlock(x, y, getRandomInt(1, 6), 'block block-box')
            }
        }
        setTimeout(async()=>{
            await setBlocks()
            await new Promise<void>(resolve=>{setTimeout(()=>resolve(),1500)})
            globalThis.processRunning = false
        },1000)        
    }

    return {gameStart}
}

export default puzzle