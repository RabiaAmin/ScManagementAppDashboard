import React, { useEffect, useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import NotFoundPage from './pages/PageNotFound'
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useDispatch } from 'react-redux';
import { getUser } from './store/Slices/userSlice';
import {getBusiness} from './store/Slices/businessSlice';
import {getAllClients} from './store/Slices/clientSlice';
import SpecialLoadingBtn from './pages/components/SpecialLoadingBtn';
import UpdateClient from './pages/UpdateClient';
function App() {
 
    const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData =  () => {
      dispatch(getUser());
      dispatch(getBusiness());
      dispatch(getAllClients());
     
    
      setLoading(false);
    }

    fetchData();
  }, [dispatch]);

  if (loading) return <div className='flex justify-center items-center min-h-screen w-100vw'>
    <SpecialLoadingBtn />
  </div>;

  return (
    <Router>
       
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/password/forgot" element={<ForgotPassword/>} />
          <Route path="/password/reset/:token" element={<ResetPassword/>} />
          <Route path="/update/:id"element={<UpdateClient/>}  />
          <Route path="*"element={<NotFoundPage/>}  />


        </Routes>

         <ToastContainer position='bottom-right' />
    
    </Router>
  )
}

export default App