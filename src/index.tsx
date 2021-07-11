import './css/style.css';
import './index.html';
import * as React from "react";
import * as ReactDOM from 'react-dom';
import store from './stores/store'
import { Provider } from 'react-redux'
import Top from './menu/top';
import Main from './components/main'
import './sound'

if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactDOM.render(
  <Provider store={store}>
  <div id="wrap">
    <Top/>
    <Main/>
  </div>
  </Provider>
, document.getElementById('app'));