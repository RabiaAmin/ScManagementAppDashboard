import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail } from "lucide-react";
import { toJpeg } from "html-to-image";
import { toast } from "react-toastify";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn";

import { useParams } from "react-router-dom";
import axios from "axios";

import jsPDF from "jspdf";
import Loader from "@/components/Loader";
const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE_VIEWINVOICE;

function ViewInvoice() {
  const { id } = useParams();
  const [bussiness, setBusiness] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [client, setClient] = useState({});
  const [invoice, setInvoice] = useState({
    items: [],
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const printRef = useRef();

  const handlePdfDownload = async () => {
    setIsDownloading(true);
    const element = printRef.current;
    if (!element) return;

    // Convert HTML to PNG
    const imgData = await toJpeg(
      element,
      { cacheBust: true, pixelRatio: 1 },
      { quality: 0.9 }
    );

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

    pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);
    pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
    setIsDownloading(false);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`, {
          withCredentials: true,
        });
        const inv = res.data;
        console.log("Fetched Invoice:", inv);
        setInvoice(inv.invoice);
        setBusiness(inv.invoice.fromBusiness);
        setClient(inv.invoice.toClient);
        setBankDetails(inv.bankAccount);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch invoice data"
        );
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice && !bankDetails && !client && !bussiness) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col p-4 w-full min-h-screen">
      <main className="flex-1 grid items-start gap-6 sm:px-6 sm:py-4 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-6 md:gap-8 lg:col-span-2">
          {/* Header Section */}
          <div className="flex justify-between items-center bg-muted/40 p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold dark:text-gray-100">
              Invoice {invoice.invoiceNumber}
            </h1>

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
            className="border-0 shadow-none rounded-none  p-8 h-full min-h-screen flex flex-col"
          >
            <CardHeader>
              <CardTitle className="text-6xl font-bold">TAX INVOICE</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 mb-4 gap-2">
                <div className="flex flex-col gap-6 mb-4">
                  <div className="border border-stone-400 p-4 rounded-2xl text-2xl">
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
                  <div className="border border-stone-400 p-4 rounded-2xl text-2xl">
                    <h2 className="text-2xl font-bold ">To:</h2>
                    <p>{client.name}</p>
                    <p>VAT No: {client.vatNumber}</p>
                    <p>Reg No: {client.registrationNumber}</p>
                    <p>{client.address}</p>
                    <p>
                      tel: {client.telphone} phone:{client.phone} Fax:{" "}
                      {client.fax}
                    </p>
                  </div>
                </div>

                <div className="mb-4  ">
                  <div className="border border-stone-400 p-4 rounded-2xl mb-4 ">
                    <p className="text-2xl">
                      <strong>Invoice No:</strong> {invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="border border-stone-400 p-4 rounded-2xl mb-4">
                    <p className="text-2xl">
                      <strong>Date:</strong>{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="border border-stone-400 p-4 rounded-2xl">
                    <p className="text-2xl">
                      <strong>PO Number:</strong> {invoice.poNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead className="bg-gray-200 text-2xl">
                  <tr>
                    <th className="border border-gray-300 p-4">Qty</th>
                    <th className="border border-gray-300 p-4">Description</th>
                    <th className="border border-gray-300 p-4">Unit Price</th>
                    <th className="border border-gray-300 p-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-2xl">
                  {Array.from({
                    length: Math.max(20, invoice.items?.length || 0),
                  }).map((_, index) => {
                    const item = invoice.items?.[index];
                    return (
                      <tr key={index} className="h-12">
                        <td className="border text-2xl border-gray-300 p-4 text-center">
                          {item ? item.quantity : ""}
                        </td>
                        <td className="border text-2xl border-gray-300 p-4">
                          {item ? item.description : ""}
                        </td>
                        <td className="border text-2xl border-gray-300 p-4 text-center">
                          {item
                            ? `R ${
                                item.unitPrice
                                  ? item.unitPrice.toFixed(2)
                                  : "0.00"
                              }`
                            : ""}
                        </td>
                        <td className="border text-2xl border-gray-300 p-4 text-center">
                          {item
                            ? `R ${
                                item.amount ? item.amount.toFixed(2) : "0.00"
                              }`
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals Section */}
                <tfoot>
                  <tr>
                    <td colSpan={2} className="px-4 ">
                      <p className="text-2xl font-bold">Bank Details:</p>
                    </td>
                    <td
                      colSpan={1}
                      className="border text-2xl border-gray-300 p-4 text-right font-bold"
                    >
                      Subtotal
                    </td>
                    <td className="border text-2xl border-gray-300 p-4 text-center">
                      R {(invoice.subTotal ?? 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="pl-4 text-xl pb-4">
                     <strong>Bank:</strong>   {bankDetails.bankName}
                      <br />
                      <strong>Account Name:</strong>  {bankDetails.accountHolderName}
                      <br />
                     <strong> Account Number:</strong>  {bankDetails.accountNumber}
                      <br />
                     <strong> Branch Code:</strong>  {bankDetails.branchCode}
                    </td>
                    <td
                      colSpan={1}
                      className="border  text-2xl border-gray-300 p-4 text-right font-bold"
                    >
                      Tax
                    </td>
                    <td className="border  text-2xl border-gray-300 p-4 text-center">
                      R {(invoice.tax ?? 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100  font-bold text-2xl">
                    <td colSpan={2} className="text-xl font-normal px-4 py-8">
                      <strong>Signed:</strong> ___________________     
                      <strong>Date:</strong>____________________ 
                    </td>
                    <td
                      colSpan={1}
                      className="border font-bold   border-gray-300 p-4 text-right"
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

export default ViewInvoice;
