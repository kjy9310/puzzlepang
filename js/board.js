// width
const MaxX = 9

// height
const MaxY = 9
// x -> bottom to top
// y -> left to right
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

let selected = undefined

let processFinished = false

let ComboCount = 0

let RemovedBlockCount = 0

let Points = 0

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const createBlock = (x,y, className) => {
    const type = getRandomInt(1, 6)
    const div = document.createElement('div')
    div.className = className + " " + typeToShape[type]
    div.style.left = `${x*50}px`
    div.style.top = `${-50*y}px`//`${x*50}px`
    div.dataset.x = x
    div.dataset.y = y
    div.onclick = blockOnClick
    document.getElementById('game-board').appendChild(div)
    return {
        x,
        y,
        type,
        div,
    }
}

const blockOnClick = async (event) => {
    if (!processFinished){
        return
    }
    const x = parseInt(event.target.dataset.x)
    const y = parseInt(event.target.dataset.y)
    Sounds.Pop.play()
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
    return new Promise(resolve=>{
        for (let x = 0 ; x < MaxX; x++){
            for (let y = MaxY-1; y >= 0; y--){
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

const checkBoard = (pangCheck)=>new Promise(async resolve=>{
    for (let i = 0 ; i < Board.length; i++){
        for (let j = 0 ; j < Board[i].length; j++){
            const check = Board[i][j] && await checkChain(Board[i][j])
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
    return new Promise(resolve=>{
        Sounds.Woodpecker.play()
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
            for (let j= Board[i].length; j<MaxY;j++){
                Board[i].push(createBlock(i, j, 'block block-box'))
            }
        }
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


const processing = async () =>{
    processFinished = false
    const runProcess = await checkBoard(true)
    if (runProcess) {
        ComboCount++
        await checkBoard()
        await removeBlocks()
        calculatePoints()
        
        await new Promise(resolve=>{setTimeout(()=>resolve(),400)})
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1000)})
        await processing()
    }
    processFinished = true
    ComboCount = 0
}

const loadSounds = ()=>{
    const Myang = new Audio('/sounds/Myang.mp3')
    const Coins = new Audio('/sounds/Coins.mp3')
    const Pop = new Audio('/sounds/Pop.mp3')
    const Woodpecker = new Audio('/sounds/Woodpecker.mp3')
    const Wakeup = new Audio('/sounds/Wakeup.mp3')
    return {
        Myang,
        Coins,
        Pop,
        Woodpecker,
        Wakeup
    }
}

const calculatePoints = () =>{
    console.log('calculatePoints',ComboCount, '*',RemovedBlockCount)
    Points += ComboCount * RemovedBlockCount
    Sounds.Coins.play()
    document.getElementById('score').innerText = "SCORE : " + Points
    RemovedBlockCount = 0
}

// initialize
let Sounds = loadSounds()

for (let x = 0 ; x < 9; x++){
    Board[x]=[]
    for (let y = 8; y >= 0; y--){
        Board[x][y] = createBlock(x, y, 'block block-box')
    }
}
document.getElementById('cover').style.display="block"
document.getElementById('cover').onclick=(e)=>{
    document.getElementById('cover').style.display=""
    Sounds.Wakeup.play()
    Sounds.Myang.loop=true
    
    setTimeout(async()=>{
        Sounds.Myang.play()
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1500)})
        processFinished = true
    },1000)    
}


