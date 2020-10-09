import React from 'react';
import ReactDOM from 'react-dom';
import Main from './client/Main';
import 'semantic-ui-css/semantic.min.css'
import './client/apocalypse-handler'

ReactDOM.render(<Main/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
/// https://medium.com/@FezVrasta/service-worker-updates-and-error-handling-with-react-1a3730800e6a
// serviceWorker.register();

