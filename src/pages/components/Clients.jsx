import React, { useState } from 'react'
import AddClients from './AddClients'
import AllClients from './AllClients'
import { Link } from 'react-router-dom'


function Clients() {
       const [selectedComponent , setSelectedComponent] = useState("AllClients");
  return (
    <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-4'>
       <div className='mx-auto grid w-full max-w-6xl gap-2'>
        <h1 className='text-2xl font-semibold'>Clients</h1>
       </div>
       <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]' >
        <nav className='grid gap-4 text-sm '>
           <Link to="#"  className={selectedComponent === "AllClients"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AllClients")}}>
           All Clients
          </Link >
          <Link to="#"  className={selectedComponent === "AddClient"?"font-semibold text-stone-600 border rounded-2xl border-stone-300 py-2 px-4":"text-blue-500"} onClick={()=>{setSelectedComponent("AddClient")}}>
           Add Client
          </Link>
       
         
        </nav>
        <div>
          {
      (()=>{
        switch (selectedComponent) {
          case "AddClient":
            return <AddClients/>
          case "AllClients":
            return <AllClients/>
         
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

export default Clients