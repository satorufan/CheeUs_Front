import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './store.js'
import './components/board/boardCategory.css';
import './components/board/boardTop.css';
import './components/board/detailBoard.css';
import './components/freeboard/freeBoard.css'
import './components/freeboard/detailFreeBoard.css'
import './components/dtboard/DTBinputForm.css';
import './components/dtboard/DTBoard.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  //</React.StrictMode>
);

reportWebVitals();
