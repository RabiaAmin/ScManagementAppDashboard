import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";
import Loader from "../components/Loader";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";

export default function CashFlowReport() {
  const location = useLocation();
  const { business } = useSelector((state) => state.business);
  const { start, end } = location.state || {};

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();
  const { isDownloading, handlePdfDownload } = usePdfDownloader();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_CASH_FLOW_REPORT;

  const format = (n) =>
    n || n === 0 ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}?startDate=${start}&endDate=${end}`,
          { withCredentials: true }
        );
        setReport(res.data.report);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch Cash Flow report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [start, end]);

  if (loading) return <Loader />;
  if (!report) return <p>No cash flow data available.</p>;

  const currency = business?.currency || "R";

  return (
    <div className="p-8">
      {/* PDF Download */}
      <div className="flex justify-end mb-4">
        {isDownloading ? (
          <SpecialLoadingBtn />
        ) : (
          <Button onClick={() => handlePdfDownload(printRef, `CashFlow_Report`)} disabled={isDownloading}>
            Download PDF
          </Button>
        )}
      </div>

      <div ref={printRef} className="bg-white p-12  rounded-none border-none shadow-none">
        {/* Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl font-extrabold">{business?.name}</h1>
          <p className="text-lg text-gray-700 mt-1">Cash Flow Report</p>
          <p className="text-sm text-gray-600 mt-2">
            Reporting Period: <span className="font-semibold">{report.period.startDate}</span> –{" "}
            <span className="font-semibold">{report.period.endDate}</span>
          </p>
        </div>

        {/* Summary */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-l-4 pl-3 border-blue-500">1. Summary</h2>
          <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border p-3 font-semibold">Description</th>
                <th className="border p-3 font-semibold">Amount ({currency})</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border p-3">Total Cash Inflow</td>
                <td className="border p-3 font-medium">{format(report.totalCashInflow)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border p-3">Total Cash Outflow</td>
                <td className="border p-3 font-medium">{format(report.totalCashOutflow)}</td>
              </tr>
              <tr className="bg-blue-50 font-semibold">
                <td className="border p-3">Net Cash Flow</td>
                <td className="border p-3">{format(report.netCashFlow)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Inflow Transactions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-3 border-l-4 pl-3 border-green-600">2. Cash Inflows</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Reference</th>
                  <th className="border p-3">Description</th>
                  <th className="border p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.inflowTransactions?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-5 text-gray-500">
                      No inflow transactions
                    </td>
                  </tr>
                ) : (
                  report.inflowTransactions?.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="border p-3">{t.date?.slice(0, 10)}</td>
                      <td className="border p-3">{t.reference}</td>
                      <td className="border p-3">{t.description}</td>
                      <td className="border p-3">{format(t.amount)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outflow Transactions */}
        <div>
          <h2 className="text-2xl font-bold mb-3 border-l-4 pl-3 border-red-600">3. Cash Outflows</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Reference</th>
                  <th className="border p-3">Description</th>
                  <th className="border p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {report.outflowTransactions?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-5 text-gray-500">
                      No outflow transactions
                    </td>
                  </tr>
                ) : (
                  report.outflowTransactions?.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="border p-3">{t.date?.slice(0, 10)}</td>
                      <td className="border p-3">{t.reference}</td>
                      <td className="border p-3">{t.description}</td>
                      <td className="border p-3">{format(t.amount)}</td>
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
