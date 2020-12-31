let array = []
let j = 0

for (let i = 0 ; i < 9; i++){
    array[i]=[]
    for (let j = 0 ; j < 9; j++){
        array[i][j] = block(i, j, 'block block-box')
        document.getElementById('game-board').appendChild(array[i][j])
    }
}
// document.getElementById('game-board').appendChild(block('block-box'))

const reloadBoard = async () => {
    // return new Promise(async resolve=>{
        // console.log('reloadBoard')
        // document.getElementById('game-board').innerHtml=""
        for (let i = 0 ; i < array.length; i++){
            for (let j = 0 ; j < array[i].length; j++){
                const check = array[i][j] && await checkChain(array[i][j])
                if (check){
                    array[i][j].dataset.delete = "1"
                    array[i][j].innerText += 0
                    array[i][j].style.backgroundColor="white"
                }
            }
        }
        setTimeout(()=>sortBoard(),1000)
        // resolve()
    // })
}

const sortBoard = () => { 
    console.log('sortBoard')
    for (let i = 0 ; i < array.length; i++){
        let emptyIndex = 0
        for (let j = 0 ; j < array[i].length; j++){
            if (array[i][j]&&array[i][j].dataset.delete==="1"){
                document.getElementById('game-board').removeChild(array[i][j])
                array[i][j]=undefined
                emptyIndex = j
            }
        }

    }
    // for (let i = 0 ; i < array.length; i++){
        
    // }
}

const checkChain = async (self, direction) => {
    const x = self.dataset.x
    const y = self.dataset.y
    const diff = [
        {x:-1, y: -1},
        {x:0, y: -1},
        {x:1, y: -1},
        {x:-1, y: 0},
        {x:1, y: 0},
        {x:-1, y: 1},
        {x:0, y: 1},
        {x:1, y: 1},
    ]
    if (direction) {
        const opposite = diff[direction]
        const {x:diffX, y:diffY} = opposite
        const checkX = (parseInt(x)+diffX)
        const checkY = (parseInt(y)+diffY)
        const checkNode = array[checkX]&&array[checkX][checkY]
        return (checkNode && checkNode.dataset.type === self.dataset.type)
    }else{
        for (let i = 0 ; i < diff.length; i++){
            const {x:diffX, y:diffY} = diff[i]
            const checkX = (parseInt(x)+diffX)
            const checkY = (parseInt(y)+diffY)
            const checkNode = array[checkX]&&array[checkX][checkY]
            if (checkNode && checkNode.dataset.type === self.dataset.type){
                const opposite = diff[7-i]
                const {x:diffX, y:diffY} = opposite
                const checkX = (parseInt(x)+diffX)
                const checkY = (parseInt(y)+diffY)
                const oppositeNode = array[checkX]&&array[checkX][checkY]
                return (oppositeNode && oppositeNode.dataset.type === self.dataset.type) ? true : (direction ? false : await checkChain(checkNode, i))
            }
        }
        return false
    }   
}