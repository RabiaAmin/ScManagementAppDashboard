import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";

function ViewStatement() {
  const { state: invoice } = useLocation();
  const [bussiness, setBusiness] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);

    // ✅ Sort invoices as soon as invoice data is available
  const sortedInvoices = useMemo(() => {
    if (!invoice?.invoices) return [];
    return [...invoice.invoices].sort((a, b) => {
      // Convert to number if invoiceNumber is a string
      return Number(a.invoiceNumber) - Number(b.invoiceNumber);
    });
  }, [invoice]);


  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_BUSINESS_VIEW}`,
          { withCredentials: true }
        );
        setBusiness(res.data.business);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch business data"
        );
      }
    };

    fetchBusiness();
  }, []);

  const printRef = useRef();

  const handlePdfDownload = async () => {
    setIsDownloading(true);
    const element = printRef.current;
    if (!element) return;

    // Convert HTML to PNG
    const imgData = await toPng(element, { cacheBust: true });

    // Create A4 PDF in mm
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Get image properties
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth; // fit full width
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width; // keep aspect ratio

    // If image is taller than A4, scale to fit page height instead
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    if (imgHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (imgProps.width * pageHeight) / imgProps.height;
    }

    // Center the image
    const x = (pageWidth - finalWidth) / 2;
    const y = 0;

    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
    pdf.save(`invoice_statement.pdf`);
    setIsDownloading(false);
  };

  if (!invoice) {
    return <p>No data available. Please go back.</p>;
  }

  return (
    <div className="flex flex-col p-4 w-full min-h-screen">
      <main className="flex-1 grid items-start gap-6 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-6 md:gap-8 lg:col-span-2">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-muted/40 p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold dark:text-gray-100">Invoice</h1>

            <div className="flex gap-4">
              {isDownloading ? (
                <SpecialLoadingBtn />
              ) : (
                <Button
                  onClick={handlePdfDownload}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              )}
              
            </div>
          </div>

          {/* Invoice Content */}
          <Card
            ref={printRef}
            className="shadow-md p-8 h-full min-h-screen flex flex-col"
          >
            <CardHeader>
              <CardTitle className="text-6xl font-bold">STATEMENT</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 mb-4 gap-2">
                <div className="flex flex-col gap-6 mb-4">
                  <div className="border border-stone-400 p-4 rounded-2xl text-xl">
                    <h2 className="text-2xl font-bold">From:</h2>
                    <p>{bussiness.name}</p>
                    <p>
                      VAT No: {bussiness.vatNumber} CK Number:{" "}
                      {bussiness.ckNumber}
                    </p>
                    <p>{bussiness.address}</p>
                    <p>
                      cell: {bussiness.phone} Tel: {bussiness.telPhone}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="border border-stone-400 p-4 rounded-2xl text-xl">
                    <h2 className="text-2xl font-bold">To:</h2>
                    <p>{invoice.invoices[0].client.name}</p>
                    <p>
                      VAT No: {invoice.invoices[0].client.vatNumber} Reg No:{" "}
                      {invoice.invoices[0].client.registrationNumber}
                    </p>

                    <p>{invoice.invoices[0].client.address}</p>
                    <p>
                      tel: {invoice.invoices[0].client.telphone} Fax:{" "}
                      {invoice.invoices[0].client.fax}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-stone-400 p-4 rounded-2xl mb-4">
                <p className="text-2xl">
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead className="bg-gray-200 text-xl">
                  <tr>
                    <th className="border border-gray-300 p-4">
                      Invoice Number{" "}
                    </th>
                    <th className="border border-gray-300 p-4">PO Number</th>
                    <th className="border border-gray-300 p-4">Code</th>
                    <th className="border border-gray-300 p-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xl">
                  {Array.from({
                    length: Math.min(20),
                  }).map((_, index) => {
                    const item = sortedInvoices?.[index];
                    return (
                      <tr key={index} className="h-12">
                        <td className="border text-xl border-gray-300 p-4 text-center">
                          {item ? item.invoiceNumber : ""}
                        </td>
                        <td className="border text-xl border-gray-300 p-4 text-center">
                          {item ? item.poNumber : ""}
                        </td>
                        <td className="border text-xl border-gray-300 p-4 text-center">
                          {item
                            ? item.items.map((i) => i.description).join(",")
                            : ""}
                        </td>
                        <td className="border text-xl border-gray-300 p-4 text-center">
                          {item ? item.totalAmount : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals Section */}
                <tfoot>
                  <tr className="bg-gray-100  font-bold text-xl">
                    <td
                      colSpan={3}
                      className="border font-bold  border-gray-300 p-4 text-right "
                    >
                      Total Amount
                    </td>
                    <td className="border border-gray-300 p-4 text-center">
                      R {(invoice.totalAmount ?? 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ViewStatement;
