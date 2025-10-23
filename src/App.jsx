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
import { getUser } from './store/slices/userSlice';
import {getAllInvoicesOFThisMonth} from "./store/slices/invoiceSlice";
import {getAllExpenses} from './store/slices/expenseSlice';

import {getBusiness} from './store/slices/businessSlice';
import {getAllClients} from './store/slices/clientSlice';
import UpdateClient from './pages/UpdateClient';

import ViewInvoice from './pages/ViewInvoice';
import UpdateInvoice from './pages/UpdateInvoice';
import ViewStatement from './pages/ViewStatement';
import UpdateExpense from './pages/UpdateExpense';
import PrintableExpenseReport from './pages/components/PrintableExpenseReport';
import AddAccount from './pages/components/AddAccount';

function App() {
 
    const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData =  () => {

       const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const start = first.toISOString().split("T")[0];
    const end = last.toISOString().split("T")[0];
      dispatch(getUser());
      dispatch(getBusiness());
      dispatch(getAllClients());
      dispatch(getAllInvoicesOFThisMonth(1,40));
      dispatch(getAllExpenses(start , end));
     
    
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
          <Route path="/expense/update/:id" element={<UpdateExpense/>} />
          <Route path="/statements"element={<ViewStatement/>}  />
          <Route path="/expense/report" element={<PrintableExpenseReport/>}  />
          <Route path="/addAccount" element={<AddAccount/>} />

          <Route path="*"element={<NotFoundPage/>}  />


        </Routes>

         <ToastContainer position='bottom-right' />
    
    </Router>
  )
}

export default App