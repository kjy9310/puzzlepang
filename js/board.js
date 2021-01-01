// width
const MaxX = 9

// height
const MaxY = 9

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

const typeToShape = {
    1:"blue",
    2:"green",
    3:"red",
    4:"magenta",
    5:"purple",
}

let processFinished = false

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

// x -> bottom to top
// y -> left to right

const createBlock = (x,y, className) => {
    // starting x is alway top
    const type = getRandomInt(1, 6)
    const div = document.createElement('div')
    div.className = className + " " + typeToShape[type]
    div.style.left = `${x*50}px`
    div.style.top = `${-50*y}px`//`${x*50}px`
    div.dataset.x = x
    div.dataset.y = y
    // div.innerText = type
    div.onclick = blockOnClick
    document.getElementById('game-board').appendChild(div)
    return {
        x,
        y,
        type,
        div,
        deleteFlag:false,
        // moveBlock
    }
}

let selected = undefined
const blockOnClick = async (event) => {
    if (!processFinished){
        return
    }
    // const checkRes = await checkChain(Board[x][y])
    // console.log('checkRes', checkRes)
    const x = parseInt(event.target.dataset.x)
    const y = parseInt(event.target.dataset.y)
    
    if (selected===undefined){
        selected = Board[x][y]
        selected.div.style.border="15px inset white"
    } else {
        selected.div.style.border=""
        const temp = Board[x][y]
        
        const beforeY = selected.y
        const beforeX = selected.x

        temp.x = beforeX
        temp.y = beforeY

        Board[x][y] = selected
        Board[x][y].x = x
        Board[x][y].y = y

        Board[beforeX][beforeY] = temp
        
        selected = undefined
        await setBlocks()
        setTimeout(()=>processing(),1100)
    }
}

const setBlocks = () =>{
    // loop array and set x,y with top left
    return new Promise(resolve=>{
        for (let x = 0 ; x < 9; x++){
            for (let y = 8; y >= 0; y--){
                Board[x][y].div.style.top = `${400-50*y}px`
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

const checkBoard = (need2Run)=>new Promise(async resolve=>{
    for (let i = 0 ; i < Board.length; i++){
        for (let j = 0 ; j < Board[i].length; j++){
            const check = Board[i][j] && await checkChain(Board[i][j])
            if (check){
                if (need2Run) {
                    resolve(true)
                }
                Board[i][j].delete = "1"
            }
        }
    }
    resolve(false)
})

let RemovedBlockCount = 0

const removeBlocks = () =>{
    return new Promise(resolve=>{
        for (let i = 0 ; i < Board.length; i++){
            let newArray = []
            for (let j = 0 ; j < Board[i].length; j++){
                if (Board[i][j]&&Board[i][j].delete==="1"){
                    RemovedBlockCount++
                    const targetNode = Board[i][j].div
                    targetNode.className+=" deleted"
                    setTimeout(()=>document.getElementById('game-board').removeChild(targetNode),1000)
                }else{
                    newArray.push(Board[i][j])
                }
            }
            Board[i] = newArray
            for (let j= Board[i].length; j<9;j++){
                Board[i].push(createBlock(i, j, 'block block-box'))
            }
        }
        console.log('RemovedBlockCount', RemovedBlockCount)
        resolve()
    })
}

const checkChain = async (self, direction) => {
    const x = self.x
    const y = self.y
    
    if (direction) {
        const opposite = Around[direction]
        const {x:diffX, y:diffY} = opposite
        const checkX = (parseInt(x)+diffX)
        const checkY = (parseInt(y)+diffY)
        const checkObject = Board[checkX]&&Board[checkX][checkY]
        return (checkObject && checkObject.type === self.type)
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

let ComboCount = 0

const processing = async () =>{
    processFinished = false
    const runProcess = await checkBoard(true)
    if (runProcess) {
        ComboCount++
        console.log('ComboCount', ComboCount)
        await checkBoard()
        await removeBlocks()
        calculatePoints()
        RemovedBlockCount = 0
        await new Promise(resolve=>{setTimeout(()=>resolve(),400)})
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1000)})
        await processing()
    }
    processFinished = true
    ComboCount = 0
}

let Points = 0

const calculatePoints = () =>{
    console.log('calculatePoints',ComboCount, '*',RemovedBlockCount)
    Points += ComboCount * RemovedBlockCount
    document.getElementById('score').innerText = "SCORE : " + Points
}

for (let x = 0 ; x < 9; x++){
    Board[x]=[]
    for (let y = 8; y >= 0; y--){
        Board[x][y] = createBlock(x, y, 'block block-box')
        
    }
}

setTimeout(async()=>{
    await setBlocks()
    await new Promise(resolve=>{setTimeout(()=>resolve(),1500)})
    processFinished = true
    // await processing()
    // let processingCount = 0
    // let runProcess = true
    // while(runProcess){
    //     runProcess = await checkBoard(true)
    //     processingCount++
    //     console.log('processingCount', processingCount)
    //     await processing()
    // }
},1000)
