import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AllExpense from './AllExpense'
import AddExpense from './AddExpense'
import UpdateExpense from './UpdateExpense'
import ManageExpenseCategory from './ManageExpenseCategory'

function Expense() {
    const [selectedComponent , setSelectedComponent] = useState("All")
  return (
    <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-4'>
       <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-2xl font-semibold'>Expense Management</h1>
       </div>
       <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]' >
        <nav className='grid gap-4 text-sm '>
           <Link to="#"  className={selectedComponent === "All"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("All")}}>
           All Expenses
          </Link >
          <Link to="#"  className={selectedComponent === "Add"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("Add")}}>
          Add Expense
          </Link>
          <Link to="#"  className={selectedComponent === "Update"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("Update")}}>
           Update Expense
          </Link>
          <Link to="#"  className={selectedComponent === "Manage"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("Manage")}}>
           Manage Expense Categories
          </Link>
       
         
        </nav>
        <div>
          {
      (()=>{
        switch (selectedComponent) {
          case "All":
            return <AllExpense/>
          case "Add":
            return <AddExpense/>
          case "Update":
            return <UpdateExpense/>
        case "Manage":
            return <ManageExpenseCategory/>
         
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

export default Expense