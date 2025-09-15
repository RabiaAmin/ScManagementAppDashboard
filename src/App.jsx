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
import {getAllInvoicesOFThisMonth} from "./store/Slices/invoiceSlice"
import {getBusiness} from './store/Slices/businessSlice';
import {getAllClients} from './store/Slices/clientSlice';
import UpdateClient from './pages/UpdateClient';

import ViewInvoice from './pages/ViewInvoice';
import UpdateInvoice from './pages/UpdateInvoice';
import ViewStatement from './pages/ViewStatement';
function App() {
 
    const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

       const now = new Date();

    // Start of the month
    const first = new Date(now.getFullYear(), now.getMonth(), 1);

    // End of the month
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format as YYYY-MM-DD
    const startDate = first.toISOString().split("T")[0];
    const endDate = last.toISOString().split("T")[0];
   
    const fetchData =  () => {
      dispatch(getUser());
      dispatch(getBusiness());
      dispatch(getAllClients());
      dispatch(getAllInvoicesOFThisMonth(startDate,endDate));
     
    
      setLoading(false);
    }

    fetchData();
  }, [dispatch]);

  if (loading) return <div className='flex justify-center items-center min-h-screen w-100vw'>
    <Loader />
  </div>;

  return (
    <Router>
       
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/password/forgot" element={<ForgotPassword/>} />
          <Route path="/password/reset/:token" element={<ResetPassword/>} />
          <Route path="/update/:id"element={<UpdateClient/>}  />
          <Route path="/invoice/:id"element={<ViewInvoice/>}  />
          <Route path="/invoice/update/:id"element={<UpdateInvoice/>}  />
          <Route path="/statements"element={<ViewStatement/>}  />

          <Route path="*"element={<NotFoundPage/>}  />


        </Routes>

         <ToastContainer position='bottom-right' />
    
    </Router>
  )
}

export default App