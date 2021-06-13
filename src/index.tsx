// import * as board from './board.js';
import './css/style.css';
import './index.html';
import * as React from "react";
import * as ReactDOM from 'react-dom';
// import Top from './menu/top';

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactDOM.render(
  <><div>test</div></>
  // <Top/>
  // <Provider store={store}>
  //   <App />
  // </Provider>
, document.getElementById('app'));