import * as React from 'react';
import * as ReactDom from 'react-dom';
import Application from './components/Application/Application';
import './style.css';

declare const PRELOADED_FETCH_STATE: object;
declare const __PRELOADED_STATE__: object;

ReactDom.render(<Application />, document.getElementById('root'));
