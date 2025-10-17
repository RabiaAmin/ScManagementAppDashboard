import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAllInvoicesOFThisMonth } from "@/store/slices/invoiceSlice";
import { Input } from "@/components/ui/input";
import SpecialLoadingBtn from "./SpecialLoadingBtn";


function Dashboard() {
  const { business } = useSelector((state) => state.business);
  const { clients } = useSelector((state) => state.client);
  const { loading,stats,totalRecords} = useSelector((state) => state.invoice);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(true);
  const dispatch = useDispatch();
  const [loadingSearch, setLoadingSearch] = useState(false);


useEffect(() => {
  const now = new Date();

  // Start of last month (e.g., 2025-09-01)
const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

// End of last month (e.g., 2025-09-30)
const endDate = new Date(now.getFullYear(), now.getMonth(), 0); // 0th day of current month = last day of previous month

  const formatLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const start = formatLocalDate(startDate);
const end = formatLocalDate(endDate);

  setStartDate(start);
  setEndDate(end);

  fetchInvoices(startDate, endDate);
}, []);


const fetchInvoices = (startDate, endDate) => {
  const page = 1; // or your current page state if you have pagination
  const limit = 40; // or whatever limit you use
  dispatch(getAllInvoicesOFThisMonth(page, limit, startDate, endDate));
};



  if (loading && !business && !clients ) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col p-2  ">
      <div className="w-full mb-4 ">
         <div className="flex items-end gap-2 my-4 justify-end">
        <div>
            <label className="text-stone-400">Start Date</label>
           <Input type="date"  className="bg-stone-100" value={startDate} onChange={(e)=>{setStartDate(e.target.value); setIsSearch(false) }}  />
        </div>
        <div>
            <label className="text-stone-400">End Date</label>

           <Input type="date" className="bg-stone-100" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>
       <div>

         {
         loadingSearch ? <SpecialLoadingBtn/> :
        <Button  disabled={isSearch}   onClick={()=>{fetchInvoices(startDate,endDate);setLoadingSearch(true)}} >
         Search 
       </Button>
         } 

        </div>

        </div></div>
      <main className=" grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">
            {/* Business Info */}
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  {business.name} <br />
                  {business.address} <br />
                  {business.phone} <br />
                  {business.email}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="">
                  <Button className="border bg-transparent border-primary text-primary hover:bg-primary hover:text-muted cursor-pointer">
                    Visit Company Website
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Current Clients */}
            <Card className="flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-stone-500">
                  Current Active Clients
                </CardTitle>
                <CardTitle className="text-6xl">
                  {clients && clients.length}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Total Invoices (all-time) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-stone-500">Total Invoices</CardTitle>
                <CardTitle className="text-6xl">
                  {totalRecords}
                </CardTitle>
              </CardHeader>
            </Card>

         

            {/* Total Revenue (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-blue-600">
                  Total Revenue <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-xl">R {stats.totalRevenue}</CardTitle>
              </CardHeader>
            </Card>

            {/* Outstanding Revenue (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Outstanding Revenue <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-xl">
                  R {stats.outstandingRevenue}
                </CardTitle>
              </CardHeader>
            </Card>
               {/* Paid Amount (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-green-600">
                  Paid Amount <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-xl">
                  R {stats.PaidAmount}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Total Invoices <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-4xl">
                  R {stats.totalInvoicesOfThisMonth}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* total vat Collected */}
               <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Total vatCollected <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-4xl">
                  R {stats.collectedVAT}
                </CardTitle>
              </CardHeader>
            </Card>

              {/* total Net revenue */}
               <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Net Revenue <br /> <span className="text-sm text-stone-500">
                    ({new Date(stats.startDate).toLocaleDateString()} - {new Date(stats.endDate).toLocaleDateString()})
                    </span> 
                </CardTitle>
                <CardTitle className="text-4xl">
                  R {stats.netRevenue}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

       
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
