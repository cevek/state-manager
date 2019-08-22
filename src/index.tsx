import * as React from 'react';
import * as ReactDom from 'react-dom';
import Application from './components/Application/Application';
import './style.css';

window.__PRELOADED_FETCH_STATE__ = {};
window.__PRELOADED_STATE__ = { first: 9, second: { b: 9 } };

ReactDom.render(<Application />, document.getElementById('root'));
