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
import { HashRouter, Routes, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegisterPage/UserRegistrationPage';
import OrdersPage from './components/OrdersPage/OrdersPage';
import AdministratorPage from './components/AdministratorPage/AdministratorPage';
import AdministratorPageCategory from './components/AdministratorPageCategory/AdministratorPageCategory';
import AdministratorPageFeature from './components/AdministratorPageFeature/AdministratorPageFeature';
import AdministratorPageArticle from './components/AdministratorPageArticle/AdministratorPageArticle';
import AdministratorPagePhoto from './components/AdministratorPagePhoto/AdministratorPagePhoto';
import ArticlePage from './components/ArticlePage/ArticlePage';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes >
        <Route path='/' element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/category/:cId" element ={<CategoryPage/>}/>
        <Route path="/user/register" element={<UserRegistrationPage/>}/>
        <Route path="/article/:aId" element={<ArticlePage/>}/>
        <Route path="/user/order" element={<OrdersPage/>}/>
        <Route path='/admin/dashboard' element={<AdministratorPage/>}/>
        <Route path='/admin/dashboard/category' element={<AdministratorPageCategory/>}/>
        <Route path='/admin/dashboard/features/:cId' element={<AdministratorPageFeature/>}/>
        <Route path='/admin/dashboard/photo/:aId' element={<AdministratorPagePhoto/>}/>
        <Route path='/admin/dashboard/articles' element={<AdministratorPageArticle/>}/>


      </Routes >
    </HashRouter>
  </React.StrictMode>
);


reportWebVitals();
