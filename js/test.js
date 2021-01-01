// let array = []
// let j = 0

// for (let i = 0 ; i < 9; i++){
//     array[i]=[]
//     for (let j = 0 ; j < 9; j++){
//         array[i][j] = block(i, j, 'block block-box')
//         document.getElementById('game-board').appendChild(array[i][j].node)
//     }
// }
// setTimeout(()=>sortBoard(),1000)
// // document.getElementById('game-board').appendChild(block('block-box'))

// const reloadBoard = async () => {
//     for (let i = 0 ; i < array.length; i++){
//         for (let j = 0 ; j < array[i].length; j++){
//             const check = array[i][j] && await checkChain(array[i][j])
//             if (check){
//                 array[i][j].delete = "1"
//                 array[i][j].node.innerText += 0
//                 array[i][j].node.style.backgroundColor="white"
//             }
//         }
//     }
//     sortBoard()
// }

// const sortBoard = () => { 
//     console.log('sortBoard')
//     for (let i = 0 ; i < array.length; i++){
//         for (let j = 0 ; j < array[i].length; j++){
//             if (array[i][j]&&array[i][j].delete==="1"){
//                 document.getElementById('game-board').removeChild(array[i][j].node)
//                 array[i].splice(j,1)
//                 j--
//             }
//         }
//         console.log('deleted array', array[i])
//         for (let j= array[i].length; j<9;j++){
//             array[i].push(block(i, j, 'block block-box'))
//         }
//         console.log('changed array', array[i])
//     }
//     for (let i = 0 ; i < array.length; i++){
//         for (let j = 0 ; j < array[i].length; j++){
//             array[i][j].node.style.top = `${i*50}px`
//         }
//     }
// }

// const checkChain = async (self, direction) => {
//     const x = self.x
//     const y = self.y
//     const diff = [
//         {x:-1, y: -1},
//         {x:0, y: -1},
//         {x:1, y: -1},
//         {x:-1, y: 0},
//         {x:1, y: 0},
//         {x:-1, y: 1},
//         {x:0, y: 1},
//         {x:1, y: 1},
//     ]
//     if (direction) {
//         const opposite = diff[direction]
//         const {x:diffX, y:diffY} = opposite
//         const checkX = (parseInt(x)+diffX)
//         const checkY = (parseInt(y)+diffY)
//         const checkObject = array[checkX]&&array[checkX][checkY]
//         return (checkObject && checkObject.type === self.type)
//     }else{
//         for (let i = 0 ; i < diff.length; i++){
//             const {x:diffX, y:diffY} = diff[i]
//             const checkX = (parseInt(x)+diffX)
//             const checkY = (parseInt(y)+diffY)
//             const checkObject = array[checkX]&&array[checkX][checkY]
//             if (checkObject && checkObject.type === self.type){
//                 const opposite = diff[7-i]
//                 const {x:diffX, y:diffY} = opposite
//                 const checkX = (parseInt(x)+diffX)
//                 const checkY = (parseInt(y)+diffY)
//                 const oppositeObject = array[checkX]&&array[checkX][checkY]
//                 return (oppositeObject && oppositeObject.type === self.type) ? true : (direction ? false : await checkChain(checkObject, i))
//             }
//         }
//         return false
//     }   
// }