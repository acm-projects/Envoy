import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Upload from './pages/Upload';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';

ReactDOM.render(

    <Router>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/account' element={<Account/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>,

  document.getElementById('root')
);

