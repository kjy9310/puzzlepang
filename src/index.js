import * as board from './board.js';
import css from './css/style.css';
import html from './index.html';

board()

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}