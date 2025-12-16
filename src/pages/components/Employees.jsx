
import React, { useState } from 'react'
import AllEmployess from './AllEmployess';
import AddEmployee from './AddEmployee';
import { Link } from 'react-router-dom';
import AddEmolplyeeLoan from './AddEmolplyeeLoan';
import AllEmployeeLoans from './AllEmployeeLoans';
import EmployeeLoanPage from './EmployeeLoanPage';
function Employees() {
       const [selectedComponent , setSelectedComponent] = useState("AllEmployees");
  return (
    <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-4'>
       <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-2xl font-semibold'>Employees</h1>
       </div>
       <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]' >
        <nav className='grid gap-4 text-sm '>
           <Link to="#"  className={selectedComponent === "AllEmployees"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AllEmployees")}}>
           All  Employees
          </Link >
          <Link to="#"  className={selectedComponent === "AddEmployee"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AddEmployee")}}>
           Add Employee
          </Link>
             <Link to="#"  className={selectedComponent === "AddEmployeeLoan"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AddEmployeeLoan")}}>
           Add Employee Loan
          </Link>
          <Link to="#"  className={selectedComponent === "AllEmployeeLoan"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AllEmployeeLoan")}}>
           All Employee Loan
          </Link>
          <Link to="#"  className={selectedComponent === "EmployeeLoanPage"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("EmployeeLoanPage")}}>
           Employee Loan Page
          </Link>
       
         
        </nav>
        <div>
          {
      (()=>{
        switch (selectedComponent) {
          case "AddEmployee":
            return <AddEmployee/>
          case "AllEmployees":
            return <AllEmployess />
          case "AddEmployeeLoan":
            return <AddEmolplyeeLoan/>
          case "AllEmployeeLoan":
            return <AllEmployeeLoans />
          case "EmployeeLoanPage":
            return <EmployeeLoanPage />
         
          default:
            return null; 
        }
      })()
     }
        </div>
       </div>
    </main>
  )
}

export default Employees