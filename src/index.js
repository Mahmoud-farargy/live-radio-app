import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import "./desgin/index.scss";
import 'react-jinke-music-player/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index";
import './i18n';

ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
      <Suspense fallback="loading...">
          <App />
      </Suspense>
      </BrowserRouter>
    </Provider>
  ,
  document.getElementById('app-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
