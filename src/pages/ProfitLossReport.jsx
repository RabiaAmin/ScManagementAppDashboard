import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";
import { Button } from "@/components/ui/button";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_PROFIT_LOSS_REPORT;

function ProfitLossReport() {
  const location = useLocation();
  const { business } = useSelector((state) => state.business);
  const { start, end } = location.state || {};
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDownloading, handlePdfDownload } = usePdfDownloader();
  const printRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}?startDate=${start}&endDate=${end}`,
          { withCredentials: true }
        );
        setReportData(res.data.report);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [start, end]);

  if (loading) return <p>Loading report...</p>;
  if (!reportData) return <p>No report available.</p>;

  const r = reportData;

  const format = (num) => num?.toLocaleString() || "0";

  return (
    <div className="w-full min-h-screen flex flex-col  bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-end p-10">
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

      {/* Header Section */}
      <div
        ref={printRef}
        className="bg-white w-full max-w-6xl self-center"
       
      >
        <div className=" p-6 mb-8 w-full">
          <h2 className="text-3xl font-bold">
            {business?.name || "Company Name"}
          </h2>
          <p>
            VAT No: {business.vatNumber} | CK: {business.ckNumber}
          </p>
          <p>{business.address}</p>
          <p>
            Cell: {business.phone} | Tel: {business.telPhone}
          </p>

          <h3 className="text-xl font-semibold mt-6">
            Profit & Loss Statement
          </h3>
          <p className="text-gray-500 text-sm">
            Period: {start} to {end}
          </p>
        </div>
        {/* Main P&L Section */}
        <div className=" p-8   space-y-10">
          {/* Revenue Section */}
          <div>
            <h3 className="text-2xl font-bold border-b pb-2 mb-3">
              Revenue / Income
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Sales of Finished Garments</td>
                  <td className="text-right font-semibold">
                    {format(r.revenue.finishedGarments)}
                  </td>
                </tr>
                <tr>
                  <td>Job Work Income (CMT Services)</td>
                  <td className="text-right font-semibold">
                    {format(r.revenue.cmtServices)}
                  </td>
                </tr>
                <tr>
                  <td>Other Income</td>
                  <td className="text-right font-semibold">
                    {format(r.revenue.otherIncome)}
                  </td>
                </tr>
                <tr className="font-bold border-t">
                  <td>Total Revenue</td>
                  <td className="text-right">{format(r.revenue.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* COGS */}
          <div>
            <h3 className="text-2xl font-bold border-b pb-2 mb-3">
              Cost of Goods Sold (COGS)
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Fabric & Trims</td>
                  <td className="text-right">{format(r.cogs.fabricTrims)}</td>
                </tr>
                <tr>
                  <td>Labor (Cutting, Sewing, Finishing)</td>
                  <td className="text-right">{format(r.cogs.labor)}</td>
                </tr>
                <tr>
                  <td>Factory Overheads</td>
                  <td className="text-right">{format(r.cogs.overheads)}</td>
                </tr>
                <tr>
                  <td>Packaging & Shipping</td>
                  <td className="text-right">{format(r.cogs.packaging)}</td>
                </tr>
                <tr className="font-bold border-t">
                  <td>Total COGS</td>
                  <td className="text-right">{format(r.cogs.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Gross Profit */}
          <div className="p-4 bg-green-100 rounded border">
            <h3 className="text-xl font-bold">Gross Profit</h3>
            <p className="text-right text-2xl font-bold text-green-700">
              {format(r.grossProfit)}
            </p>
          </div>

          {/* Operating Expenses */}
          <div>
            <h3 className="text-2xl font-bold border-b pb-2 mb-3">
              Operating Expenses
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Administrative Expenses</td>
                  <td className="text-right">{format(r.operating.admin)}</td>
                </tr>
                <tr>
                  <td>Sales & Marketing</td>
                  <td className="text-right">
                    {format(r.operating.salesMarketing)}
                  </td>
                </tr>
                <tr>
                  <td>Rent & Utilities</td>
                  <td className="text-right">
                    {format(r.operating.rentUtilities)}
                  </td>
                </tr>
                <tr>
                  <td>Depreciation & Maintenance</td>
                  <td className="text-right">
                    {format(r.operating.depreciation)}
                  </td>
                </tr>
                <tr>
                  <td>Other Expenses</td>
                  <td className="text-right">{format(r.operating.other)}</td>
                </tr>

                <tr className="font-bold border-t">
                  <td>Total Operating Expenses</td>
                  <td className="text-right">{format(r.operating.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Operating Profit */}
          <div className="p-4 bg-blue-100 rounded border">
            <h3 className="text-xl font-bold">Operating Profit (EBIT)</h3>
            <p className="text-right text-2xl font-bold text-blue-700">
              {format(r.operatingProfit)}
            </p>
          </div>

          {/* Non-Operating Items */}
          <div>
            <h3 className="text-2xl font-bold border-b pb-2 mb-3">
              Non-Operating Items
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Interest Income</td>
                  <td className="text-right">
                    {format(r.nonOperating.interestIncome)}
                  </td>
                </tr>
                <tr>
                  <td>Interest Expense</td>
                  <td className="text-right">
                    {format(r.nonOperating.interestExpense)}
                  </td>
                </tr>
                <tr>
                  <td>Other Non-Operational Gains/Losses</td>
                  <td className="text-right">{format(r.nonOperating.other)}</td>
                </tr>

                <tr className="font-bold border-t">
                  <td>Total Non-Operating</td>
                  <td className="text-right">{format(r.nonOperating.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PBT */}
          <div className="p-4 bg-yellow-100 rounded border">
            <h3 className="text-xl font-bold">Profit Before Tax (PBT)</h3>
            <p className="text-right text-2xl font-bold text-yellow-700">
              {format(r.profitBeforeTax)}
            </p>
          </div>

          {/* Tax */}
          <div>
            <h3 className="text-2xl font-bold mb-1">Income Tax Expense</h3>
            <p className="text-right text-lg">{format(r.taxExpense)}</p>
          </div>

          {/* NET PROFIT */}
          <div className="p-4 bg-purple-100 rounded border">
            <h3 className="text-xl font-bold">Net Profit / (Loss)</h3>
            <p className="text-right text-3xl font-bold text-purple-700">
              {format(r.netProfit)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitLossReport;
