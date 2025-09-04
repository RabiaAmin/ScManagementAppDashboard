import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail, Printer } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import axios from "axios";

import jsPDF from "jspdf";
const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE;

function ViewInvoice() {
  const { id } = useParams();
  const [businessId, setBusinessId] = useState("");
  const [clientId, setClientId] = useState("");
  const [bussiness, setBusiness] = useState({});
  const [client, setClient] = useState({});
  const [invoice, setInvoice] = useState({
    items: [],
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
  });

  const printRef = useRef();

const handlePdfDownload = async () => {
  const element = printRef.current;
  if (!element) return;

  // Convert HTML to PNG
  const imgData = await toPng(element, { cacheBust: true });

  // Create A4 PDF in mm
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
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
  pdf.save(`invoice_${invoice.invoiceNumber}.pdf`);
};





  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get/${id}`, {
          withCredentials: true,
        });
        const inv = res.data.invoice;
        setInvoice(inv);
        setBusinessId(inv.fromBusiness);
        setClientId(inv.toClient);
        setInvoice(inv);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch invoice data"
        );
      }
    };
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_BUSINESS}/get`,
          { withCredentials: true }
        );
        setBusiness(res.data.business);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch business data"
        );
      }
    };
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_CLIENT}/get/${clientId}`,
          { withCredentials: true }
        );
        setClient(res.data.client);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch client data"
        );
      }
    };
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

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
            <Button
              onClick={handlePdfDownload}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button  className="flex items-center gap-2  cursor-pointer">
              <Mail className="w-4 h-4" /> Send Mail
            </Button>
           
          </div>
          </div>

          {/* Invoice Content */}
          <Card ref={printRef} className="shadow-md p-6 h-full min-h-screen flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-bold">TAX INVOICE</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 mb-4 gap-2">
                <div className="flex flex-col gap-6 mb-4">
                  <div className="border border-stone-400 p-4 rounded-2xl">
                    <h2 className="font-bold">From:</h2>
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
                  <div className="border border-stone-400 p-4 rounded-2xl">
                    <h2 className="font-bold">To:</h2>
                    <p>{client.name}</p>
                    <p>VAT No: {client.vatNumber}</p>
                    <p>Reg No: {client.registrationNumber}</p>
                    <p>{client.address}</p>
                    <p>
                      tel: {client.telphone} Fax: {client.fax}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="border border-stone-400 p-4 rounded-2xl mb-4">
                    <p>
                      <strong>Invoice No:</strong> {invoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="border border-stone-400 p-4 rounded-2xl mb-4">
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="border border-stone-400 p-4 rounded-2xl">
                    <p>
                      <strong>PO Number:</strong> {invoice.poNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-gray-300 mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2">Qty</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Unit Price</th>
                    <th className="border border-gray-300 p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({
                    length: Math.max(20, invoice.items?.length || 0),
                  }).map((_, index) => {
                    const item = invoice.items?.[index];
                    return (
                      <tr key={index} className="h-12">
                        <td className="border border-gray-300 p-2 text-center">
                          {item ? item.quantity : ""}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item ? item.description : ""}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {item
                            ? `R${
                                item.unitPrice
                                  ? item.unitPrice.toFixed(2)
                                  : "0.00"
                              }`
                            : ""}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {item
                            ? `R${
                                item.amount ? item.amount.toFixed(2) : "0.00"
                              }`
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p>
                    <strong>Subtotal:</strong> R
                    {(invoice.subTotal ?? 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Tax:</strong> R{(invoice.tax ?? 0).toFixed(2)}
                  </p>
                  <p className="font-bold text-lg">
                    <strong>Total:</strong> R
                    {(invoice.totalAmount ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

         
        </div>
      </main>
    </div>
  );
}

export default ViewInvoice;
