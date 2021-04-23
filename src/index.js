import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { registerMicroApps, start, setDefaultMountApp } from 'qiankun';
import apps from './apps'

function render({ appContent, loading }) {
  const container = document.getElementById('main-root');
  ReactDOM.render(
    <React.StrictMode>
      <App loading={loading} content={appContent} />
    </React.StrictMode>,
    container,
  )
}

const loader = loading => render({ loading });

render({ loading: true });

const microApps = apps.map((app => ({
  ...app,
  loader,
})))
registerMicroApps(microApps, {
  beforeLoad: app => {
    console.log('before load app.name=====>>>>>', app.name)
  },
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    app => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
    }
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
})

setDefaultMountApp('/react')

start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
