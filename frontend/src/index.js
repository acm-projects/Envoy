import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Upload from './pages/Upload';
import Library from './pages/Library';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './features/internationalization/i18n';

ReactDOM.render(

    <Router>
      <Routes>
        <Route path='/' element={<App/>}/> 
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/library' element={<Library/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>,

  document.getElementById('root')
);

