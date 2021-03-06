// width
const MaxX = 7

// height
const MaxY = 7
document.getElementById("inner").style.width=`${MaxX*50+10}px`
document.getElementById("inner").style.height=`${MaxY*50+10}px`
document.getElementById("game-board").style.width=`${MaxX*50}px`
document.getElementById("game-board").style.height=`${MaxY*50}px`
document.getElementById('message').style.lineHeight=`${MaxY*50}px`
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

let MaximumCombo = 0

let RemovedBlockCount = 0

let Points = 0

let MoveCount = 5

const CoverNode = document.getElementById('cover')

const MessageNode = document.getElementById('message')

const ScoreScroll = document.getElementById('score-scroll')

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
    if (!processFinished || MoveCount<1){
        return
    }
    const x = parseInt(event.target.dataset.x)
    const y = parseInt(event.target.dataset.y)
    Sounds.Pop.play()
    if (selected===undefined){
        selected = Board[x][y]
        selected.div.style.border="10px inset violet"
    } else if (selected === Board[x][y]) {
        selected.div.style.border=""
        selected=undefined
        return
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
        updateMoveCount(-1)
        processFinished = false
        setTimeout(()=>processing(),1100)
    }
}

const updateMoveCount = (count) =>{
    MoveCount+=count
    document.getElementById('move').innerText=MoveCount
}

const setBlocks = () =>{
    return new Promise(resolve=>{
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
// to do 스택으로 미리 삭제될거 쌓아둬서 여러개 체크가능하게 해보기
const checkBoard = (pangCheck)=>new Promise(async resolve=>{
    for (let i = 0 ; i < Board.length; i++){
        for (let j = 0 ; j < Board[i].length; j++){
            const check = Board[i][j] && Board[i][j].delete !== "1" &&await checkChain(Board[i][j])
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
        RemovedBlockCount>7 && updateMoveCount(1)
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
        if (checkObject && checkObject.type === self.type) {
            Board[checkX][checkY].delete="1"
            Board[x][y].delete="1"
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
    MessageNode.innerText=""
    CoverNode.style.backgroundColor="transparent"
    CoverNode.style.opacity="1"
    CoverNode.style.display="block"
    const runProcess = await checkBoard(true)
    if (runProcess) {
        ComboCount++
        if (MaximumCombo<ComboCount){
            MaximumCombo = ComboCount
            document.getElementById('max-combo').innerText=MaximumCombo
        }
        await checkBoard()
        await removeBlocks()
        calculatePoints()
        
        await new Promise(resolve=>{setTimeout(()=>resolve(),400)})
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1000)})
        await processing()
    } else if (MoveCount<1) {
        gameOver()
        return
    }
    CoverNode.style.display="none"
    processFinished = true
    ComboCount = 0
}

const loadSounds = ()=>{
    const Coins = new Audio('/sounds/Coins.mp3')
    const Pop = new Audio('/sounds/Pop.mp3')
    const Woodpecker = new Audio('/sounds/Woodpecker.mp3')
    
    return {
        Coins,
        Pop,
        Woodpecker,
    }
}

const gameOver = () =>{
    CoverNode.style.backgroundColor=""
    CoverNode.style.opacity=".9"
    MessageNode.innerHTML = "GAME OVER!"
    
    CoverNode.style.display="block"
    Sounds.Myang.pause()
    Sounds.Gameover.play()
}

const calculatePoints = () =>{
    ScoreScroll.style.visibility="visible"
    ScoreScroll.innerText="+"+ComboCount * RemovedBlockCount
    ScoreScroll.className="up"
    setTimeout(()=>{
        ScoreScroll.className=""
        ScoreScroll.style.visibility="hidden"
    },800)
    Points += ComboCount * RemovedBlockCount
    MessageNode.style.fontSize=`${20+2*ComboCount}px`
    MessageNode.style.transform=`rotate(${(getRandomInt(0,2)>0?-2:1)*getRandomInt(1,10)}deg)`
    MessageNode.innerText=ComboCount>1?ComboCount+" Combo!!\n":"Myang!!"
    Sounds.Coins.play()
    document.getElementById('score').innerText = Points
    RemovedBlockCount = 0
}

// initialize
let Sounds = loadSounds()

for (let x = 0 ; x < MaxX; x++){
    Board[x]=[]
    for (let y = MaxY-1; y >= 0; y--){
        Board[x][y] = createBlock(x, y, 'block block-box')
    }
}
MessageNode.innerText="START!"
CoverNode.style.display="block"
CoverNode.onclick=(e)=>{
    CoverNode.style.display="none"
    document.getElementById('mute').onclick=(e)=>{
        Sounds.Myang.muted = !Sounds.Myang.muted
        e.target.className = Sounds.Myang.muted?"mute":""
    }
    setTimeout(async()=>{
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1500)})
        processFinished = true
    },1000)
    CoverNode.onclick=undefined
}