// // var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
// // if (document.getElementById(elmnt.id + "header")) {
// // /* if present, the header is where you move the DIV from:*/
// // document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
// // } else {
// // /* otherwise, move the DIV from anywhere inside the DIV:*/
// // elmnt.onmousedown = dragMouseDown;
// // }

// function dragMouseDown(e) {
// e = e || window.event;
// e.preventDefault();
// // get the mouse cursor position at startup:
// pos3 = e.clientX;
// pos4 = e.clientY;
// document.onmouseup = closeDragElement;
// // call a function whenever the cursor moves:
// document.onmousemove = elementDrag;
// }

// function elementDrag(e) {
// e = e || window.event;
// e.preventDefault();
// // calculate the new cursor position:
// pos1 = pos3 - e.clientX;
// pos2 = pos4 - e.clientY;
// pos3 = e.clientX;
// pos4 = e.clientY;
// // set the element's new position:
// elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
// elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
// }

// function closeDragElement() {
// /* stop moving when mouse button is released:*/
// document.onmouseup = null;
// document.onmousemove = null;
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min)
//     max = Math.floor(max)
//     return Math.floor(Math.random() * (max - min)) + min
// }

// const block = (x, y, className)=>{
//     // const text = `${x}-${y}`
//     const type = getRandomInt(1, 6)
//     const div = document.createElement('div')
//     div.className = className
//     div.style.left = `${y*50}px`
//     div.style.top = "-50px"//`${x*50}px`
//     div.style.backgroundColor = 'magenta'
//     div.innerText = type
//     // div.dataset.x = x
//     // div.dataset.y = y
//     // div.dataset.type = type
//     div.onclick = (event)=>blockOnClick(event, x,y)
//     return {
//         x,
//         y,
//         type,
//         node: div
//     }
// }

// let selectedBlock = undefined
// const blockOnClick = (event, x,y) => {
//     console.log('event', event.target)
//     console.log('object',array[x][y])
//     if (selectedBlock===undefined){
//         selectedBlock = array[x][y]
//         selectedBlock.node.style.border="2px solid yellow"
//     } else {
//         selectedBlock.node.style.border=""
//         const tempY = selectedBlock.y
//         const tempX = selectedBlock.x

//         selectedBlock.x = x
//         selectedBlock.y = y
        
//         selectedBlock.node.style.left = y * 50 +"px"
//         selectedBlock.node.style.top = x * 50 +"px"
        
//         array[tempX][tempY] = array[x][y]
//         array[tempX][tempY].x = tempX
//         array[tempX][tempY].y = tempY
//         array[tempX][tempY].node.style.left = tempY * 50 +"px"
//         array[tempX][tempY].node.style.top = tempX * 50 +"px"
        
//         array[x][y] = selectedBlock

//         array[tempX][tempY].node.style.zIndex = 1000
//         array[x][y].node.style.zIndex = 1000
//         setTimeout(()=>{
//             array[tempX][tempY].node.style.zIndex = ""
//             array[x][y].node.style.zIndex = ""
//             reloadBoard()
            
//         },1100)

//         selectedBlock = undefined
//     }
// }

// const moveBlock = () => {

// }