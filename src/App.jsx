import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/PageNotFound'
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
function App() {
 

  return (
    <Router>
       
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/password/forgot" element={<ForgotPassword/>} />
          <Route path="/password/reset/:token" element={<ResetPassword/>} />
          <Route path="*"element={<NotFoundPage/>}  />


        </Routes>

         <ToastContainer position='bottom-right' />
    
    </Router>
  )
}

export default App