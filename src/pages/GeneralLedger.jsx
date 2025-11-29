import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";
import Loader from "../components/Loader";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";

export default function GeneralLedger() {
  const location = useLocation();
  const { business } = useSelector((state) => state.business);
  const { start, end } = location.state || {};

  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();
  const { isDownloading, handlePdfDownload } = usePdfDownloader();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_GENERAL_LEDGER;

  const format = (n) =>
    n || n === 0 ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}?startDate=${start}&endDate=${end}`,
          { withCredentials: true }
        );

        setLedger(res.data.report);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch General Ledger"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [start, end]);

  if (loading) return <Loader />;
  if (!ledger) return <p>No ledger data available.</p>;

  return (
    <div className="p-8">
      {/* PDF Download Button */}
      <div className="flex justify-end mb-4">
        {isDownloading ? (
          <SpecialLoadingBtn />
        ) : (
          <Button
            disabled={isDownloading}
            onClick={() => handlePdfDownload(printRef, `General_Ledger_Report`)}
          >
            Download PDF
          </Button>
        )}
      </div>

      <div ref={printRef} className="bg-white p-12  rounded-none border-none shadow-none">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl font-extrabold">{business?.name}</h1>
          <p className="text-lg text-gray-700 mt-1">General Ledger Report</p>
          <p className="text-sm text-gray-600 mt-2">
            Reporting Period: <span className="font-semibold">{ledger.period.startDate}</span> –{" "}
            <span className="font-semibold">{ledger.period.endDate}</span>
          </p>
        </div>

        {/* Summary Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-l-4 pl-3 border-blue-500">1. Summary</h2>
          <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-3 font-semibold">Description</th>
                <th className="border p-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border p-3">Total Income (Credit)</td>
                <td className="border p-3 font-medium">{format(ledger.totalIncome)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border p-3">Total Expense (Debit)</td>
                <td className="border p-3 font-medium">{format(ledger.totalExpense)}</td>
              </tr>
              <tr className="bg-blue-50 font-semibold">
                <td className="border p-3">Closing Balance</td>
                <td className="border p-3">{format(ledger.closingBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ledger Entries */}
        <div>
          <h2 className="text-2xl font-bold mb-3 border-l-4 pl-3 border-green-600">2. Ledger Entries</h2>

          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Reference</th>
                  <th className="border p-3">Description</th>
                  <th className="border p-3">Debit</th>
                  <th className="border p-3">Credit</th>
                  <th className="border p-3">Running Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.ledgerEntries?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-5 text-gray-500">
                      No transactions in this period
                    </td>
                  </tr>
                ) : (
                  ledger.ledgerEntries?.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="border p-3">{entry.date?.slice(0, 10)}</td>
                      <td className="border p-3">{entry.reference}</td>
                      <td className="border p-3">{entry.description}</td>
                      <td className="border p-3">{format(entry.debit)}</td>
                      <td className="border p-3">{format(entry.credit)}</td>
                      <td className="border p-3">{format(entry.runningBalance)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
