import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { MainMenu, MainMenuItem } from './components/MainMenu/MainMenu';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ContactPage } from './components/ContactPage/ContactPage';
import { UserLoginPage } from './components/UserLoginPage/UserLoginPage';


const menuItems = [
  new MainMenuItem("Home", "/"),
  new MainMenuItem("Contact", "/contact"),
  new MainMenuItem("Log in", "/user/login"),
];
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MainMenu items={menuItems} />
    <HashRouter>
      <Routes >
        <Route index path='/'  element={<HomePage/>} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/user/login" element={<UserLoginPage/>} />
      </Routes >
    </HashRouter>
  </React.StrictMode>
);


reportWebVitals();
