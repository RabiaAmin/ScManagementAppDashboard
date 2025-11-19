import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { Button } from "@/components/ui/button";

export default function TransactionReport() {
  const reports = [
    {
      title: 'Profit / Loss Report',
      path: '/profit-loss-report',
      description: 'View monthly revenue, expenses, and final profit/loss overview.'
    },
    {
      title: 'VAT Summary Report',
      path: '/vat-summary-report',
      description: 'Generate VAT return summary including output & input VAT.'
    },
    {
      title: 'Cash Flow Report',
      path: '/cash-flow-report',
      description: 'Analyze inflow and outflow of cash for better financial insights.'
    },
    {
      title: 'VAT General Ledger',
      path: '/vat-ledger',
      description: 'Detailed ledger of all VAT-related transactions.'
    },
    {
      title: 'Full General Ledger',
      path: '/general-ledger',
      description: 'Complete ledger containing all transactions for bookkeeping.'
    },
  ];

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSearch, setIsSearch] = useState(true);
    const [isSearchLoading, setIsSearchLoading] = useState(false);


   useEffect(() => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const start = first.toISOString().split("T")[0];
      const end = last.toISOString().split("T")[0];
  
      setStartDate(start);
      setEndDate(end);
  
    }, []);

  return (
   <div className="p-6">
      {/* --- Filter Section --- */}
      <div className="flex flex-wrap justify-between items-end mb-4">
        <div>
        
        </div>
        <div className="flex flex-wrap gap-3 items-end justify-end">
          <div>
            <label className="text-stone-400 text-sm">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setIsSearch(false);
              }}
            />
          </div>
          <div>
            <label className="text-stone-400 text-sm">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setIsSearch(false);
              }}
            />
          </div>
          <div>
            {isSearchLoading ? (
              <SpecialLoadingBtn />
            ) : (
              <Button
                disabled={isSearch}
                onClick={() => {
                  setIsSearchLoading(true);
                 
                  setTimeout(() => {
                    setIsSearchLoading(false);
                    setIsSearch(true);
                  }, 1000);
                }}
              >
                Search
              </Button>
            )}
          </div>
        </div>
      </div>

     
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {reports.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            state={{start:startDate,end:endDate}}
            className="group relative p-8 bg-white/90 backdrop-blur border border-stone-300 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-stone-800 group-hover:text-stone-900">{item.title}</h2>
              <p className="text-sm text-stone-600">{item.description}</p>
            </div>

            <span className="absolute bottom-4 right-4 text-stone-500 group-hover:text-stone-800 transition-all">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
