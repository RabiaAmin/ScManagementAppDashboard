import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { usePdfDownloader } from "@/hooks/useDownloadPdf.js";

function PrintableExpenseReport() {
  const { loading, Expenses } = useSelector((state) => state.expense);
  const { business } = useSelector((state) => state.business);
  const { isDownloading, handlePdfDownload } = usePdfDownloader();
  const printRef = useRef();

  // ✅ Calculate Totals
  const totalAmount = Expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalVat = Expenses?.reduce((sum, e) => sum + e.vatAmount, 0) || 0;
  const grandTotal = Expenses?.reduce((sum, e) => sum + e.totalAmount, 0) || 0;

  

  return (
    <div className="p-6 w-full min-h-screen flex flex-col items-center bg-white">
      {/* --- Top Download Button --- */}
      <div className="w-full max-w-6xl p-6 flex justify-end mb-6">
        {isDownloading ? (
          <SpecialLoadingBtn />
        ) : (
          <Button
            disabled={isDownloading}
            onClick={() => handlePdfDownload(printRef, `Expenses_Report`)}
          >
            Download PDF
          </Button>
        )}
      </div>
      <div className="max-w-6xl">
      {/* --- Printable Expense Report --- */}
      <Card
        ref={printRef}
        className="bg-white p-10 w-full  rounded-none border-none shadow-none"

      >
        {/* --- Header Section --- */}
        <CardHeader className="text-center pb-6 border-b border-gray-300">
          <CardTitle className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
            Company Expense Report
          </CardTitle>

          {business && (
            <div className="mt-3 text-gray-700 text-sm leading-6">
              <p className="font-semibold text-lg">{business.name}</p>
              <p>
                VAT No: {business.vatNumber} &nbsp; | &nbsp; CK No:{" "}
                {business.ckNumber}
              </p>
              <p>{business.address}</p>
              <p>
                Cell: {business.phone} &nbsp; | &nbsp; Tel: {business.telPhone}
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-3">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </CardHeader>

        {/* --- Table Section --- */}
        <CardContent className="pt-8">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : Expenses?.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No expenses found for this period.
            </p>
          ) : (
            <div className="overflow-visible">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left font-semibold p-3 border border-gray-300">
                      Date
                    </th>
                    <th className="text-left font-semibold p-3 border border-gray-300">
                      Company Name
                    </th>
                    <th className="text-left font-semibold p-3 border border-gray-300">
                      Invoice No
                    </th>
                    <th className="text-left font-semibold p-3 border border-gray-300">
                      Payment Method
                    </th>
                    <th className="text-right font-semibold p-3 border border-gray-300">
                      Amount (R)
                    </th>
                    <th className="text-right font-semibold p-3 border border-gray-300">
                      VAT (R)
                    </th>
                    <th className="text-right font-semibold p-3 border border-gray-300">
                      Total (R)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="border border-gray-200 p-3 text-gray-700">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700">
                        {expense.vendorName}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700">
                        {expense.invoiceNo}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700">
                        {expense.paymentMethod}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700 text-right">
                        {expense.amount.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-700 text-right">
                        {expense.vatAmount.toFixed(2)}
                      </td>
                      <td className="border border-gray-200 p-3 text-gray-800 font-medium text-right">
                        {expense.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  {/* ✅ Totals Row */}
                  <tr className="bg-gray-100 font-semibold text-gray-800">
                    <td
                      colSpan="4"
                      className="p-3 border-t border-gray-300 text-right"
                    >
                      Totals:
                    </td>
                    <td className="p-3 border-t border-gray-300 text-right">
                      R{totalAmount.toFixed(2)}
                    </td>
                    <td className="p-3 border-t border-gray-300 text-right">
                      R{totalVat.toFixed(2)}
                    </td>
                    <td className="p-3 border-t border-gray-300 text-right">
                      R{grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* --- Footer --- */}
        {!loading && Expenses?.length > 0 && (
          <div className="mt-6 text-right text-sm text-gray-600 border-t border-gray-300 pt-4">
            <p>
              <span className="font-semibold">Total Entries:</span>{" "}
              {Expenses.length}
            </p>
            <p>
              <span className="font-semibold">Grand Total:</span>{" "}
                R
              {Expenses.reduce(
                (sum, expense) => sum + expense.totalAmount,
                0
              ).toFixed(2)}
            </p>
            <p className="text-gray-500 mt-1 italic">
              This report was generated automatically by the system.
            </p>
          </div>
        )}
      </Card>

      </div>

    </div>
  );
}

export default PrintableExpenseReport;
