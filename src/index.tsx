import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {RecoilRoot} from "recoil";
import reportWebVitals from './reportWebVitals';
import RecoilNexus from 'recoil-nexus'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <RecoilRoot>
          <RecoilNexus/>
            <App />
      </RecoilRoot>
  </React.StrictMode>
);

reportWebVitals();
