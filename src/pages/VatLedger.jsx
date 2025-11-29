import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";
import Loader from "../components/Loader";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";

export default function VatLedger() {
  const location = useLocation();
  const { business } = useSelector((state) => state.business);
  const { start, end } = location.state || {};

  const [ledger, setLedger] = useState(null);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();
  const { isDownloading, handlePdfDownload } = usePdfDownloader();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL_VAT_LEDGER;

  const format = (n) =>
    n || n === 0 ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00";

  const currency = business?.currency || "USD";

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
          err.response?.data?.message || "Failed to fetch VAT Ledger report"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [start, end]);

  if (loading) return <Loader />;
  if (!ledger) return <p>No ledger data available.</p>;

  const summary = ledger.summary || {};
  const allLedger = ledger.ledger || [];

  // Split into OUTPUT & INPUT for table display
  const outputLedger = allLedger.filter((t) => t.type === "OUTPUT");
  const inputLedger = allLedger.filter((t) => t.type === "INPUT");

  return (
    <div className="p-8">
      {/* PDF Download Button */}
      <div className="flex justify-end mb-4">
        {isDownloading ? (
          <SpecialLoadingBtn />
        ) : (
          <Button
            disabled={isDownloading}
            onClick={() => handlePdfDownload(printRef, `VAT_Ledger_Report`)}
          >
            Download PDF
          </Button>
        )}
      </div>

      <div ref={printRef} className="bg-white p-10  rounded-none border-none shadow-none">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-1">{business?.name}</h1>
        <p className="text-lg text-gray-700 mb-6">VAT Ledger Report</p>

        <p className="text-sm text-gray-600">
          VAT Number: <strong>{business?.vatNumber || "N/A"}</strong>
        </p>

        <p className="text-sm text-gray-600 mb-6">
          Reporting Period:{" "}
          <strong>{ledger.period?.startDate}</strong> –{" "}
          <strong>{ledger.period?.endDate}</strong>
        </p>

        {/* SUMMARY */}
        <h2 className="text-xl font-bold mb-3 mt-6">1. Ledger Summary</h2>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount ({currency})</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2">Total Output VAT (Collected)</td>
              <td className="border p-2">{format(summary.totalOutputVAT)}</td>
            </tr>

            <tr>
              <td className="border p-2">Total Input VAT (Paid)</td>
              <td className="border p-2">{format(summary.totalInputVAT)}</td>
            </tr>

            <tr className="font-semibold">
              <td className="border p-2">Net VAT Payable / Refundable</td>
              <td className="border p-2">{format(summary.netVAT)}</td>
            </tr>
          </tbody>
        </table>

        {/* OUTPUT VAT LEDGER */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          2. Output VAT Ledger (Sales VAT)
        </h2>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Reference</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Taxable Amount</th>
              <th className="border p-2">VAT Amount</th>
              <th className="border p-2">Running Balance</th>
            </tr>
          </thead>

          <tbody>
            {outputLedger.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  No output VAT transactions
                </td>
              </tr>
            ) : (
              outputLedger.map((t, index) => (
                <tr key={index}>
                  <td className="border p-2">{t.date?.slice(0, 10)}</td>
                  <td className="border p-2">{t.reference}</td>
                  <td className="border p-2">{t.description}</td>
                  <td className="border p-2">{format(t.taxableAmount)}</td>
                  <td className="border p-2">{format(t.vatAmount)}</td>
                  <td className="border p-2">{format(t.balance)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <p className="text-right font-semibold mt-2">
          Total Output VAT: {format(summary.totalOutputVAT)}
        </p>

        {/* INPUT VAT LEDGER */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          3. Input VAT Ledger (Purchase VAT)
        </h2>

        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Reference</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Taxable Amount</th>
              <th className="border p-2">VAT Amount</th>
              <th className="border p-2">Running Balance</th>
            </tr>
          </thead>

          <tbody>
            {inputLedger.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3">
                  No input VAT transactions
                </td>
              </tr>
            ) : (
              inputLedger.map((t, index) => (
                <tr key={index}>
                  <td className="border p-2">{t.date?.slice(0, 10)}</td>
                  <td className="border p-2">{t.reference}</td>
                  <td className="border p-2">{t.description}</td>
                  <td className="border p-2">{format(t.taxableAmount)}</td>
                  <td className="border p-2">{format(t.vatAmount)}</td>
                  <td className="border p-2">{format(t.balance)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <p className="text-right font-semibold mt-2">
          Total Input VAT: {format(summary.totalInputVAT)}
        </p>

        {/* NET VAT */}
        <h2 className="text-xl font-bold mt-10 mb-3">4. Net VAT</h2>

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
              <td className="border p-2">{format(summary.totalOutputVAT)}</td>
            </tr>

            <tr>
              <td className="border p-2">Total Input VAT</td>
              <td className="border p-2">{format(summary.totalInputVAT)}</td>
            </tr>

            <tr className="font-semibold">
              <td className="border p-2">Net VAT</td>
              <td className="border p-2">{format(summary.netVAT)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
