
require('/sounds/Coins.mp3')
require('/sounds/Woodpecker.mp3')
require('/sounds/Wakeup.mp3')
require('/sounds/Myang.mp3')
require('/sounds/Gameover.mp3')
require('/sounds/Pop.mp3')
require('/sounds/Sibal-1740.mp3')
require('/sounds/Appayo-2564.mp3')
    
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
    1:"first",
    2:"second",
    3:"third",
    4:"forth",
    5:"fifth",
}

let EachBlocksCount = {
    1:0,
    2:0,
    3:0,
    4:0,
    5:0,
}

let selected = undefined

let processFinished = false

let ComboCount = 0

DefenseBoardStat = {
    stage: 0,
    enemyHitPoints: 1,
    stageMaxHp:1,
    enemySpeed: 1000
}

let RemovedBlockCount = 0

let Life = 3

let MoveCount = 10

let Bonuses = [
    {
        condition:{
            1:3,
            2:3
        },
        successMultiplier:3
    },
    {
        condition:{
            any:5,
        },
        successMultiplier:2
    }
]

const CoverNode = document.getElementById('cover')

const MessageNode = document.getElementById('message')

const ScoreScroll = document.getElementById('score-scroll')

const DefenseBoard = document.getElementById('defense-board')
const HeartBox = document.getElementById('heart-box')
const enemyHitPointsBox = document.getElementById('enemy-hit-points-box')

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

const createBlock = (x,y, type, className) => {
    const div = document.createElement('div')
    div.className = className + " " + typeToShape[type]
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
    if (!processFinished || MoveCount<1){
        return
    }
    const x = parseInt(event.target.dataset.x)
    const y = parseInt(event.target.dataset.y)
    Sounds.Pop.play()
    if (selected===undefined){
        selected = Board[x][y]
        selected.div.classList.add("selected")
    } else if (selected === Board[x][y]) {
        selected.div.classList.remove("selected");
        selected=undefined
        return
    } else {
        selected.div.classList.remove("selected");
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

const checkBoard = (pangCheck)=>new Promise(async resolve=>{
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
    return new Promise(resolve=>{
        Sounds.Woodpecker.play()
        RemovedBlockCount = {}
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
        await checkBoard()
        await removeBlocks()
        calculatePoints()
        await new Promise(resolve=>{setTimeout(()=>resolve(),400)})
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1000)})
        setStates()
        await processing()
    } 
    CoverNode.style.display="none"
    processFinished = true
    ComboCount = 0
}

const loadSounds = ()=>{
    const Coins = new Audio('/sounds/Coins.mp3')
    const Pop = new Audio('/sounds/Pop.mp3')
    const Woodpecker = new Audio('/sounds/Woodpecker.mp3')
    const Wakeup = new Audio('/sounds/Wakeup.mp3')
    const Myang = new Audio('/sounds/Myang.mp3')
    const Gameover = new Audio('/sounds/Gameover.mp3')
    const Sibal = new Audio('/sounds/Sibal-1740.mp3')
    const Appayo = new Audio('/sounds/Appayo-2564.mp3')
    Myang.addEventListener('timeupdate', function(){
        var buffer = .33
        if(this.currentTime > this.duration - buffer){
            this.currentTime = 0
            this.play()
        }
    })
    return {
        Myang,
        Coins,
        Pop,
        Woodpecker,
        Wakeup,
        Gameover,
        Sibal,
        Appayo
    }
}

const gameOver = async () =>{
    CoverNode.style.backgroundColor=""
    CoverNode.style.opacity=".9"
    MessageNode.innerHTML = "GAME<img src='https://static-cdn.jtvnw.net/emoticons/v1/303220977/1.0'/>OVER!"
    
    CoverNode.style.display="block"
    Sounds.Myang.pause()
    Sounds.Gameover.play()
    await EnemyArray.forEach((enemyObject)=>{
        enemyObject&&clearInterval(enemyObject.interval)
    })
    clearInterval(EnemyInterval)
}

const calculatePoints = () =>{
    const allRemovedBlockCount = Object.keys(RemovedBlockCount).reduce((acc, type)=>{
        const count = RemovedBlockCount[type]
        EachBlocksCount[type] += count
        return acc+count
    },0)
    const gainScore = ComboCount * allRemovedBlockCount * checkBonuses()
    
    ScoreScroll.style.visibility="visible"
    ScoreScroll.innerText="+"+gainScore
    ScoreScroll.className="up"
    setTimeout(()=>{
        ScoreScroll.className=""
        ScoreScroll.style.visibility="hidden"
    },800)
    DefenseBoardStat.enemyHitPoints -= gainScore
    const fontSize = 30+2*ComboCount
    MessageNode.style.fontSize=`${fontSize>70?70:fontSize}px`
    MessageNode.style.transform=`rotate(${(getRandomInt(0,2)>0?-2:1)*getRandomInt(1,10)}deg)`
    MessageNode.innerText=ComboCount>1?ComboCount+" Combo!!\n":"Myang!!"
    Sounds.Coins.play()
    RemovedBlockCount = {}    
}

const checkBonuses = () => {
    // bonus object condition:{[type]:[min count]} successMultiplier:2
    return Bonuses.reduce((acc, bonusObject, bonusIndex)=>{
        const {
            condition,
            successMultiplier
        } = bonusObject
        const objectKeys = Object.keys(condition)
        let meetRequirement = true
        for(let i = 0; i<objectKeys.length; i++){
            const bonusType = objectKeys[i]
            const minimumCount = condition[bonusType]
            if (bonusType !== "any" && ((RemovedBlockCount[bonusType]===undefined) || RemovedBlockCount[bonusType]<minimumCount)) {
                meetRequirement = false
                break;
            } else if (bonusType === "any" && Object.values(RemovedBlockCount).sort().reverse()[0]<condition[bonusType]) {
                meetRequirement = false
                break;
            }
        }
        if (meetRequirement) {
            const bonusId = "bonus"+bonusIndex
            document.getElementById(bonusId).className="block-info success"
            setTimeout(()=>{
                document.getElementById(bonusId).className="block-info"
            },300)
        }
        return acc * (meetRequirement?successMultiplier:1)
    },1)
}

const setBlockStats = () => {
    Object.keys(EachBlocksCount).forEach((type, index)=>{
        const count = EachBlocksCount[type]
        document.getElementById(`stat-${typeToShape[type]}`).innerText = count
    })
}

const setBonuses = (newBonusObject) => {
    if (newBonusObject && Bonuses.length<4){
        Bonuses.push(newBonusObject)
    }
    document.getElementById('bonuses').innerHTML=""
    Bonuses.forEach((bonusObject, index)=>{
        const singleBonusInfo = createBonusDiv(bonusObject)
        singleBonusInfo.id="bonus"+index
        document.getElementById('bonuses').appendChild(singleBonusInfo)
    })
}

const createBonusDiv = (bonusObject) => {
    const {
        condition,
        successMultiplier
    } = bonusObject
    const blockInfo = document.createElement('div')
    blockInfo.className="block-info"
    Object.keys(condition).forEach((type)=>{
        const count = condition[type]
        const block = createBlock(-1, -1, type, 'block block-box')
        block.div.style.top = "0"
        block.div.style.left = "0"
        const singleBlockInfoDiv = document.createElement('div')
        singleBlockInfoDiv.className = "block-wrap"
        const text = document.createElement('div')
        text.innerText=" "+count+" "
        singleBlockInfoDiv.appendChild(block.div)
        blockInfo.appendChild(text)
        blockInfo.appendChild(singleBlockInfoDiv)
    })
    const successMultiplierInfo = document.createElement('div')
    successMultiplierInfo.innerText="=X"+successMultiplier
    blockInfo.appendChild(successMultiplierInfo)
    return blockInfo
}

const setLifeHearts = () => {
    if (Life<1) {
        gameOver()
    }
    HeartBox.innerHTML=""
    for(let i = 0; i < Life; i++){
        const heart = document.createElement('div')
        heart.className = "defense-icon heart"
        HeartBox.appendChild(heart)
    }
}

const setEnemyHitPoints = () =>{
    if (DefenseBoardStat.enemyHitPoints<1 && StageReady) {
        document.getElementById('enemy-main').classList.add('dead')
        clearStage()
    }
    const percentage = parseInt((DefenseBoardStat.enemyHitPoints / (DefenseBoardStat.stageMaxHp)) * 100)
    enemyHitPointsBox.style.width = percentage+"px"
}

const setDefenseBoard = () => {
    setEnemyHitPoints()
    setLifeHearts()
}

let EnemyArray = []
const createEnemy = () =>{
    const index = EnemyArray.length
    const enemyDiv = document.createElement('div')
    enemyDiv.className = "defense-icon enemy"
    enemyDiv.dataset.x = 0
    // bottom 30 ~ 70 px
    enemyDiv.style.bottom = getRandomInt(30,65)+"px"
    const interval = setInterval(()=>{
        const newXdata = parseInt(enemyDiv.dataset.x) + 1
        if (newXdata > 90){
            enemyDiv.classList.add("deleted")
            Sounds.Appayo.play()
            setTimeout(()=>{
                DefenseBoard.removeChild(enemyDiv)
            },1000)
            Life--
            MoveCount++
            clearInterval(interval)
            EnemyArray[index]=undefined
            setStates()
        }
        enemyDiv.dataset.x = newXdata
        enemyDiv.style.left = newXdata+"%"
    }, DefenseBoardStat.enemySpeed)
    EnemyArray[index]={
        enemyDiv,
        interval
    }
    DefenseBoard.appendChild(enemyDiv)
}

const setStage = () => {
    document.getElementById('stage-number').innerText = DefenseBoardStat.stage
    const stageMaxHp = 3000 * Math.pow(DefenseBoardStat.stage, .5)
    DefenseBoardStat.enemyHitPoints = stageMaxHp
    DefenseBoardStat.stageMaxHp = stageMaxHp
    DefenseBoardStat.enemySpeed = 1000 * Math.pow(DefenseBoardStat.stage, -.065)
    const generationSpeed = 60060 * Math.pow(DefenseBoardStat.stage, -.1)
    createEnemy()
    EnemyInterval = setInterval(()=>createEnemy(), generationSpeed)
    StageReady = true
    setStates()
}

let spellCastable = true
const activateSpell = async (event, type) =>{
    if (!spellCastable){
        return
    }
    spellCastable = false
    Sounds.Pop.play()
    event.target.classList.add('selected')
    setTimeout(()=>{
        event.target.classList.remove('selected')
    },300)
    switch(type){
        case 1:
            if (EachBlocksCount[1] >= 0){
                EachBlocksCount[1] -= 0
                console.log('EnemyArray',EnemyArray)
                document.getElementById('blackcow-animation').classList.add('active')

                await EnemyArray.forEach((enemyObject, index)=>{
                    const {enemyDiv} = enemyObject
                    console.log('foreach', index, enemyDiv)
                    if (enemyDiv){
                        const newXdata = parseInt(enemyDiv.dataset.x) - 21
                        EnemyArray[index].enemyDiv.dataset.x = newXdata<0?0:newXdata
                    }
                })
                setTimeout(()=>{
                    spellCastable = true
                    document.getElementById('blackcow-animation').classList.remove('active')
                }, 3000)
            } else {
                spellCastable = true
            }
            break;
        case 2:
            if (EachBlocksCount[2] >= 10){
                EachBlocksCount[2] -= 10
                MoveCount += 1
            }
            spellCastable = true
            break;
        case 3:
            if (EachBlocksCount[3] >= 50 && Life<3){
                EachBlocksCount[3] -= 50
                Life++
            }
            spellCastable = true
            break;
        case 4:
            if (EachBlocksCount[4] >= 50){
                EachBlocksCount[4] -= 50
                const newEnemyHp = DefenseBoardStat.enemyHitPoints - 8000
                DefenseBoardStat.enemyHitPoints = newEnemyHp<1? 0 : newEnemyHp  
                document.getElementById('paw').classList.add('active')
                setTimeout(()=>{
                    spellCastable = true
                    document.getElementById('paw').classList.remove('active')
                }, 1000)
            } else {
                spellCastable = true
            }
            break;
        case 5:
            if (EachBlocksCount[5] >= 50){
                EachBlocksCount[5] -= 50
                document.getElementById('spell-burn').classList.add('active')
                Sounds.Sibal.play()
                await EnemyArray.forEach((enemyObject, index)=>{
                    if (enemyObject) {
                        const {
                            enemyDiv,
                            interval
                        } = enemyObject
                        DefenseBoard.removeChild(enemyDiv)
                        MoveCount++
                        clearInterval(interval)
                        EnemyArray[index]=undefined
                    }
                })
                setTimeout(()=>{
                    document.getElementById('spell-burn').classList.remove('active')
                    spellCastable = true
                }, 800)
            } else {
                spellCastable = true
            }
            break;
        default:
    }
    setStates()
}

const setStates = () => {
    EnemyArray = EnemyArray.filter((enemyObject)=>enemyObject&&enemyObject.enemyDiv)
    updateMoveCount(0)
    setBlockStats()
    setDefenseBoard()

}

let StageReady = false

const clearStage = async () => {
    clearInterval(EnemyInterval)
    await EnemyArray.forEach((enemyObject, index)=>{
        if (enemyObject){
            const {
                enemyDiv,
                interval
            } = enemyObject
            DefenseBoard.removeChild(enemyDiv)
            clearInterval(interval)
            EnemyArray[index]=undefined
        }
    })
    StageReady=false
    DefenseBoardStat.stage += 1
    MoveCount+=5
    if (DefenseBoardStat.stage>1){
        document.getElementById('reward').style.display="block"
        document.getElementById('reward-box').innerText="STAGE CLEAR!"
        document.getElementById('reward-line').classList.remove('hidden')
        document.getElementById('reward-box').onclick=()=>{
            document.getElementById('reward').style.display=""
            document.getElementById('enemy-main').classList.remove('dead')
            document.getElementById('reward-line').classList.add('hidden')
            document.getElementById('reward-box').onclick=undefined
            setStage()
        }
    }else{
        setStage()
    }
}

// initialize
let Sounds = loadSounds()
let EnemyInterval
setBonuses()
for (let x = 0 ; x < MaxX; x++){
    Board[x]=[]
    for (let y = MaxY-1; y >= 0; y--){
        Board[x][y] = createBlock(x, y, getRandomInt(1, 6), 'block block-box')
    }
}
MessageNode.innerText="START!"
CoverNode.style.display="block"
CoverNode.onclick=(e)=>{
    CoverNode.style.display="none"
    Sounds.Wakeup.play()
    document.getElementById('mute').onclick=(e)=>{
        Sounds.Myang.muted = !Sounds.Myang.muted
        e.target.className = Sounds.Myang.muted?"mute":""
    }
    setTimeout(async()=>{
        Sounds.Myang.play()
        await setBlocks()
        await new Promise(resolve=>{setTimeout(()=>resolve(),1500)})
        processFinished = true
        // Sounds.Myang.volume = 0.5;
    },1000)
    CoverNode.onclick=undefined
    document.getElementById("spell-first").onclick=(e)=>activateSpell(e,1)
    document.getElementById("spell-second").onclick=(e)=>activateSpell(e,2)
    document.getElementById("spell-third").onclick=(e)=>activateSpell(e,3)
    document.getElementById("spell-forth").onclick=(e)=>activateSpell(e,4)
    document.getElementById("spell-fifth").onclick=(e)=>activateSpell(e,5)
    clearStage()
}
setStates()

