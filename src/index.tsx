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
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { Container, Nav } from 'react-bootstrap';


const menuItems = [
  new MainMenuItem("Home", "/"),
  new MainMenuItem("Contact", "/contact/"),
  new MainMenuItem("Log in", "/user/login/"),

  new MainMenuItem("cat1", "/category/1/"),
  new MainMenuItem("cat5", "/category/5/"),
  new MainMenuItem("cat7", "/category/7/"),
];
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Container >
        <Nav variant='tabs'>
          <MainMenu items={menuItems} />
        </Nav>
      </Container>
      <Routes >
        <Route index path='/' element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/category/:cId" element={<CategoryPage match={{
          params: { cId: 2 }
        }} />} />
      </Routes >
    </HashRouter>
  </React.StrictMode>
);


reportWebVitals();
