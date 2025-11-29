import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";
import Loader from "../components/Loader";
import { Button } from "@/components/ui/button";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";

export default function VatSummaryReport() {
  const location = useLocation();
  const { business } = useSelector((state) => state.business);
  const { start, end } = location.state || {};
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();
  const { isDownloading, handlePdfDownload } = usePdfDownloader();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_VAT_SUMMARY_REPORT;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}?startDate=${start}&endDate=${end}`,
          { withCredentials: true }
        );
        setReportData(res.data.report);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch VAT report"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [start, end]);

  if (loading) return <Loader />;
  if (!reportData) return <p>No report available.</p>;

  const r = reportData;
  const currency = business?.currency || "ZAR";
  const format = (n) => (n ? n.toLocaleString() : "0.00");

  return (
    <div className="p-8">
      <div className="flex justify-end mb-4">
        {isDownloading ? (
          <SpecialLoadingBtn />
        ) : (
          <Button
            disabled={isDownloading}
            onClick={() => handlePdfDownload(printRef, `Profit&Loss_Report`)}
          >
            Download PDF
          </Button>
        )}
      </div>

  <div ref={printRef} className="bg-white p-12  rounded-none border-none shadow-none ">

  {/* Company Header */}
  <div className="mb-10 border-b pb-6">
    <h1 className="text-4xl font-extrabold tracking-wide">{business?.name}</h1>
    <p className="text-lg text-gray-700 mt-1">VAT Summary Report</p>

    <div className="mt-4 text-sm text-gray-600 leading-relaxed">
      <p>VAT Number: <span className="font-semibold">{business?.vatNumber || "N/A"}</span></p>
      <p>Reporting Period: <span className="font-semibold">{start}</span> – <span className="font-semibold">{end}</span></p>
    </div>
  </div>

  {/* Overview Section */}
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 border-l-4 pl-3 border-blue-500">1. Overview</h2>

    <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="border p-3 font-semibold">Summary</th>
          <th className="border p-3 font-semibold">Amount ({currency})</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border p-3">Total VAT Collected (Output VAT)</td>
          <td className="border p-3 font-medium">{format(r.outputVAT)}</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="border p-3">Total VAT Paid (Input VAT)</td>
          <td className="border p-3 font-medium">{format(r.inputVAT)}</td>
        </tr>
        <tr className="bg-blue-50 font-semibold">
          <td className="border p-3">Net VAT Payable / Refundable</td>
          <td className="border p-3">{format(r.netVAT)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Output VAT Section */}
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-2 border-l-4 pl-3 border-green-600">
      2. VAT Collected (Output VAT)
    </h2>
    <p className="text-sm text-gray-600 mb-3">VAT charged on sales & income</p>

    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3">Date</th>
            <th className="border p-3">Ref No.</th>
            <th className="border p-3">Customer</th>
            <th className="border p-3">Taxable Amount</th>
            <th className="border p-3">VAT Rate</th>
            <th className="border p-3">VAT Amount</th>
          </tr>
        </thead>

        <tbody>
          {r.outputTransactions?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-5 text-gray-500">
                No output VAT transactions
              </td>
            </tr>
          ) : (
            r.outputTransactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="border p-3">{t.date?.slice(0, 10)}</td>
                <td className="border p-3">{t.reference}</td>
                <td className="border p-3">{t.customerOrSupplier}</td>
                <td className="border p-3">{format(t.taxableAmount)}</td>
                <td className="border p-3">{t.vatRate}</td>
                <td className="border p-3">{format(t.vatAmount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <p className="text-right font-semibold mt-3 text-gray-700">
      Subtotal Output VAT: {format(r.outputVAT)}
    </p>
  </div>

  {/* Input VAT Section */}
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-2 border-l-4 pl-3 border-purple-600">
      3. VAT Paid (Input VAT)
    </h2>
    <p className="text-sm text-gray-600 mb-3">VAT paid on expenses & purchases</p>

    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3">Date</th>
            <th className="border p-3">Ref No.</th>
            <th className="border p-3">Supplier</th>
            <th className="border p-3">Taxable Amount</th>
            <th className="border p-3">VAT Rate</th>
            <th className="border p-3">VAT Amount</th>
          </tr>
        </thead>

        <tbody>
          {r.inputTransactions?.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center p-5 text-gray-500">
                No input VAT transactions
              </td>
            </tr>
          ) : (
            r.inputTransactions.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="border p-3">{t.date?.slice(0, 10)}</td>
                <td className="border p-3">{t.reference}</td>
                <td className="border p-3">{t.customerOrSupplier}</td>
                <td className="border p-3">{format(t.taxableAmount)}</td>
                <td className="border p-3">{t.vatRate}</td>
                <td className="border p-3">{format(t.vatAmount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <p className="text-right font-semibold mt-3 text-gray-700">
      Subtotal Input VAT: {format(r.inputVAT)}
    </p>
  </div>

  {/* Final Net VAT */}
  <div>
    <h2 className="text-2xl font-bold mb-3 border-l-4 pl-3 border-orange-500">
      4. Net VAT Calculation
    </h2>

    <table className="w-full border text-sm rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-3">Description</th>
          <th className="border p-3">Amount ({currency})</th>
        </tr>
      </thead>

      <tbody>
        <tr className="hover:bg-gray-50">
          <td className="border p-3">Total Output VAT</td>
          <td className="border p-3">{format(r.outputVAT)}</td>
        </tr>

        <tr className="hover:bg-gray-50">
          <td className="border p-3">Total Input VAT</td>
          <td className="border p-3">{format(r.inputVAT)}</td>
        </tr>

        <tr className="font-semibold bg-blue-50">
          <td className="border p-3">Net VAT Payable / Refund</td>
          <td className="border p-3">{format(r.netVAT)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
}
