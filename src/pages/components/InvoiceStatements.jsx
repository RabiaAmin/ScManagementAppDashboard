import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import SpecialLoadingBtn from "../components/SpecialLoadingBtn"
import { Button } from "@/components/ui/button";
const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE;

function InvoiceStatements() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate , setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(true);
  

  useEffect(() => {
    const now = new Date();

    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const dayOfWeek = lastWeek.getDay(); 
    const first = new Date(lastWeek);
    first.setDate(lastWeek.getDate() - dayOfWeek); 
    const last = new Date(first);
    last.setDate(first.getDate() + 6); 

    const startDate = first.toISOString().split("T")[0]; 
    const endDate = last.toISOString().split("T")[0]; 
 
    setStartDate(startDate);
    setEndDate(endDate);

    fetchStatements(startDate,endDate);
  }, []);

   const fetchStatements = async (start,end) => {
      try {
       
        const res = await axios.get(
          `${BASE_URL}/weekly-statements?startDate=${start}&endDate=${end}&_=${new Date().getTime()}`,
          { withCredentials: true }
        );
        const data = res.data.statements;
       
        setStatements(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch weekly statements"
        );
      } finally {
        setLoading(false);
        setIsSearch(true);
      }
    };

 

 
  if (loading)
    return <p className="text-center">Loading weekly statements...</p>;

  return (
    <div className="p-6">
      <div className="flex items-end gap-2 my-4 justify-end">
        <div>
            <label className="text-stone-400">Start Date</label>
           <Input type="date" value={startDate} onChange={(e)=>{setStartDate(e.target.value); setIsSearch(false) }}  />
        </div>
        <div>
            <label className="text-stone-400">End Date</label>

           <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>
        <div>

         {
         loading ? <SpecialLoadingBtn/> :
        <Button  disabled={isSearch}   onClick={()=>{fetchStatements(startDate,endDate);setLoading(true)}} >
         Search 
       </Button>
         } 

        </div>

       
       

      </div>
      <h2 className="text-2xl font-bold mb-4">Weekly Invoice Statements</h2>
      {statements.length === 0 ? (
        <p>No invoices found for this week.</p>
      ) : (
        <div className="space-y-6">
          {statements.map((invoice) => (
            <div
              key={invoice._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition"
            >
              {
                invoice.invoices ? (
                   <Link to={`/statements`} state={invoice}>
                {" "}
                {/* Pass clientId to route */}
                <h3 className="text-xl font-semibold">{invoice._id}</h3>
                <p>Total Invoices: {invoice.totalInvoices}</p>
                <p>Total Amount: R {invoice.totalAmount.toFixed(2)}</p>
              </Link>
                ) : (
                  <div> data is not available </div>
                )
              }
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoiceStatements;
