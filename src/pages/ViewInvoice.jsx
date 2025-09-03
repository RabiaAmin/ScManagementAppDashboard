import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Mail, Printer } from "lucide-react";

import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import axios from "axios";
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

  //   // Dummy Data
  //   const invoice = {
  //     invoiceNumber: "INV-001",
  //      fromBusiness: {
  //       name: "SANIA CLOTHING CC",
  //       vatNumber: "4103254292",
  //       ckNumber: "2009/213423/23",
  //       address: "86 Devis Hurley Street (Queen Street), Bassa Building, Durban, 4001, RSA",
  //       phone: "0848817506",
  //       telPhone: "031 032 0743",
  //       fax: "0848817506",
  //       email: "saniaclothing@gmail.com",
  //     },
  //     toclient : {
  //     name: "Ubunye Uniforms (Pty) Ltd",
  //     vatNumber: "4130319626",
  //     registrationNumber: "2001/014969/07",
  //     address:
  //       "P.O. Box 201763, Umgeni Business Park, Durban North, 4016, South Africa",
  //     phone: "(031) 263 1460",
  //     fax: "(031) 263 1988",
  //     email: "xyz@gmail.com",
  //     telphone: "(031) 263 1460",
  //   },
  //     poNumber: "PO-2025-15",
  //     date: "2025-09-03",
  //     status: "Paid",
  //     items: [
  //       { quantity: 2, description: "Website Design", unitPrice: 1500, amount: 3000 },
  //       { quantity: 1, description: "Mobile App Development", unitPrice: 2500, amount: 2500 },
  //     ],
  //     subTotal: 5500,
  //     tax: 825,
  //     totalAmount: 6325,
  //   };

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
            <Link to={"/"}>
              <Button>Back to Dashboard</Button>
            </Link>
          </div>

          {/* Invoice Content */}
          <Card className="shadow-md p-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">TAX INVOICE</CardTitle>
            </CardHeader>
            <CardContent>
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
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        R{item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        R{item.amount ? item.amount.toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p>
                    <strong>Subtotal:</strong> R{(invoice.subTotal ?? 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Tax:</strong> R{(invoice.tax ?? 0).toFixed(2)}
                  </p>
                  <p className="font-bold text-lg">
                    <strong>Total:</strong> R{(invoice.totalAmount ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
            <Button className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Send Mail
            </Button>
            <Button className="flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewInvoice;
