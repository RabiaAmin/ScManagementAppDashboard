
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AddBookTransaction from './AddBookTransaction.jsx'
import ManageBookTransaction from './ManageBookTransaction.jsx'
import TransactionReport from './TransactionReport.jsx'


function BookKeeping() {
      const [selectedComponent , setSelectedComponent] = useState("TransactionReport")
  return (
   <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-4'>
       <div className='mx-auto grid w-full h-full max-w-6xl gap-2'>
        <h1 className='text-2xl font-semibold'>Book Keeping</h1>
       </div>
       <div className='mx-auto grid w-full h-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]' >
        <nav className='grid gap-4 text-sm '>
           <Link to="#"  className={selectedComponent === "TransactionReport"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("TransactionReport")}}>
           Generate Reports
          </Link >
         
          <Link to="#"  className={selectedComponent === "Add"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("Add")}}>
          Add Transaction
          </Link>
          <Link to="#"  className={selectedComponent === "Manage"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("Manage")}}>
           Manage Transaction
          </Link>
          
       
         
        </nav>
        <div>
          {
      (()=>{
        switch (selectedComponent) {
          case "TransactionReport":
            return <TransactionReport/>
          case "Add":
            return <AddBookTransaction/>
          case "Manage":
            return <ManageBookTransaction/>
     
         
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

export default BookKeeping