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

const reloadBoard = () => {
    console.log('reloadBoard')
    document.getElementById('game-board').innerHtml=""
    for (let i = 0 ; i < array.length; i++){
        for (let j = 0 ; j < array[i].length; j++){
            document.getElementById('game-board').appendChild(array[i][j])
        }
    }
}