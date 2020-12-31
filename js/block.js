// var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
// if (document.getElementById(elmnt.id + "header")) {
// /* if present, the header is where you move the DIV from:*/
// document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
// } else {
// /* otherwise, move the DIV from anywhere inside the DIV:*/
// elmnt.onmousedown = dragMouseDown;
// }

function dragMouseDown(e) {
e = e || window.event;
e.preventDefault();
// get the mouse cursor position at startup:
pos3 = e.clientX;
pos4 = e.clientY;
document.onmouseup = closeDragElement;
// call a function whenever the cursor moves:
document.onmousemove = elementDrag;
}

function elementDrag(e) {
e = e || window.event;
e.preventDefault();
// calculate the new cursor position:
pos1 = pos3 - e.clientX;
pos2 = pos4 - e.clientY;
pos3 = e.clientX;
pos4 = e.clientY;
// set the element's new position:
elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

function closeDragElement() {
/* stop moving when mouse button is released:*/
document.onmouseup = null;
document.onmousemove = null;
}


const block = (x, y, className)=>{
    const text = `${x}-${y}`
    const div = document.createElement('div')
    div.className = className
    div.style.top = `${y*50}px`
    div.style.left = `${x*50}px`
    div.style.backgroundColor = 'magenta'
    div.innerText=text
    div.dataset.x = x
    div.dataset.y = y
    div.onclick = blockOnClick
    return div
}

let selectedBlock = undefined
const blockOnClick = (event) => {
    console.log('event', event.target)
    const x = event.target.dataset.x
    const y = event.target.dataset.y
    if (selectedBlock===undefined){
        selectedBlock = array[x][y]
        selectedBlock.style.border="2px solid yellow"
    } else {
        selectedBlock.style.border=""
        const tempY = selectedBlock.dataset.y
        const tempX = selectedBlock.dataset.x

        selectedBlock.dataset.x = x
        selectedBlock.dataset.y = y
        
        selectedBlock.style.top = y * 50 +"px"
        selectedBlock.style.left = x * 50 +"px"
        
        array[tempX][tempY] = array[x][y]
        array[tempX][tempY].dataset.x = tempX
        array[tempX][tempY].dataset.y = tempY
        array[tempX][tempY].style.top = tempY * 50 +"px"
        array[tempX][tempY].style.left = tempX * 50 +"px"
        
        array[x][y] = selectedBlock
        selectedBlock = undefined
    }
    console.log('end event', array)
}
