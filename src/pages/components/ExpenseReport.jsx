import React from 'react'
import { Link } from 'react-router-dom'

function ExpenseReport() {
  return (
    <div className='w-full h-[40vh] flex justify-center items-center'>
        <Link to={"/expense/report"} className=' p-8 hover:p-10 bg-stone-400/30 font-semibold  border border-dashed border-stone-800 '>Click here to generate monthly expense report</Link>
    </div>
  )
}

export default ExpenseReport