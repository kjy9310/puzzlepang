import './css/style.css';
import './index.html';
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Top from './menu/top';
import DefenseBoard from './components/defense-board';
import DataBoard from './components/data-board'
import PuzzleBoard from './components/puzzle-board'
import Modal from './components/modal'
import './sound-loader'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

// width
const MaxX = 7

// height
const MaxY = 7

const innerStyle = {
  width: `${MaxX*50+10}px`,
  height: `${MaxY*50+10}px`
}

ReactDOM.render(
  <div id="wrap">
    <Top/>
    <DefenseBoard/>
    <DataBoard/>
    <div id="inner" style={innerStyle}>
      <PuzzleBoard
      size={{
        x: MaxX,
        y: MaxY,
        blockSize: 50
      }}
      />
    </div>
    <Modal/>
  </div>
, document.getElementById('app'));