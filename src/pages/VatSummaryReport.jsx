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
  const currency = business?.currency || "USD";
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

      <div ref={printRef} className="bg-white p-10 shadow rounded-xl">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-1">{business?.name}</h1>
        <p className="text-lg text-gray-700 mb-6">VAT Summary Report</p>

        <p className="text-sm text-gray-600">
          VAT Number: <strong>{business?.vatNumber || "N/A"}</strong>
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Reporting Period: <strong>{start}</strong> – <strong>{end}</strong>
        </p>

        {/* Overview */}
        <h2 className="font-bold text-xl mb-3 mt-6">1. Overview</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Summary</th>
              <th className="border p-2">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total VAT Collected (Output VAT)</td>
              <td className="border p-2">{format(r.outputVAT)}</td>
            </tr>
            <tr>
              <td className="border p-2">Total VAT Paid (Input VAT)</td>
              <td className="border p-2">{format(r.inputVAT)}</td>
            </tr>
            <tr className="font-semibold">
              <td className="border p-2">Net VAT Payable / Refundable</td>
              <td className="border p-2">{format(r.netVAT)}</td>
            </tr>
          </tbody>
        </table>

        {/* Output VAT */}
        <h2 className="font-bold text-xl mt-10 mb-3">
          2. VAT Collected (Output VAT)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          VAT charged on sales & income
        </p>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Ref No.</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Taxable Amount</th>
              <th className="border p-2">VAT Rate</th>
              <th className="border p-2">VAT Amount</th>
            </tr>
          </thead>
          <tbody>
            {r.outputTransactions?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  No output VAT transactions
                </td>
              </tr>
            ) : (
              r.outputTransactions?.map((t) => (
                <tr key={t._id}>
                  <td className="border p-2">{t.date?.slice(0, 10)}</td>
                  <td className="border p-2">{t.reference}</td>
                  <td className="border p-2">{t.customerOrSupplier}</td>
                  <td className="border p-2">{format(t.taxableAmount)}</td>
                  <td className="border p-2">{t.vatRate}</td>
                  <td className="border p-2">{format(t.vatAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <p className="text-right font-semibold mt-2">
          Subtotal Output VAT: {format(r.outputVAT)}
        </p>

        {/* Input VAT */}
        <h2 className="font-bold text-xl mt-10 mb-3">
          3. VAT Paid (Input VAT)
        </h2>
        <p className="text-sm text-gray-600 mb-2">
          VAT paid on purchases, expenses, and supplier invoices
        </p>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Ref No.</th>
              <th className="border p-2">Supplier</th>
              <th className="border p-2">Taxable Amount</th>
              <th className="border p-2">VAT Rate</th>
              <th className="border p-2">VAT Amount</th>
            </tr>
          </thead>
          <tbody>
            {r.inputTransactions?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  No input VAT transactions
                </td>
              </tr>
            ) : (
              r.inputTransactions?.map((t) => (
                <tr key={t._id}>
                  <td className="border p-2">{t.date?.slice(0, 10)}</td>
                  <td className="border p-2">{t.reference}</td>
                  <td className="border p-2">{t.customerOrSupplier}</td>
                  <td className="border p-2">{format(t.taxableAmount)}</td>
                  <td className="border p-2">{t.vatRate}</td>
                  <td className="border p-2">{format(t.vatAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <p className="text-right font-semibold mt-2">
          Subtotal Input VAT: {format(r.inputVAT)}
        </p>

        {/* Net VAT */}
        <h2 className="font-bold text-xl mt-10 mb-3">4. Net VAT Calculation</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount ({currency})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Output VAT</td>
              <td className="border p-2">{format(r.outputVAT)}</td>
            </tr>
            <tr>
              <td className="border p-2">Total Input VAT</td>
              <td className="border p-2">{format(r.inputVAT)}</td>
            </tr>
            <tr className="font-semibold">
              <td className="border p-2">Net VAT Payable / Refund</td>
              <td className="border p-2">{format(r.netVAT)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
