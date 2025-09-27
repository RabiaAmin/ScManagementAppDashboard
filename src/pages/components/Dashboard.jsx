import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useInvoices } from "@/hooks/useInvoices";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

function Dashboard() {
  const { business } = useSelector((state) => state.business);
  const { clients } = useSelector((state) => state.client);
  const { loading, invoices } = useSelector((state) => state.invoice);

  // Use custom hook to get all calculated values
  const {
    totalRevenue,
    outstandingRevenue,
    upcomingDueDates,
    totalInvoicesOfThisMonth,
    PaidAmount
  } = useInvoices(invoices);

  const navigateTo = useNavigate();
  const handleViewInvoice = (id) => {
    navigateTo(`/invoice/${id}`);
  };

  if (loading || !business || !clients ) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col p-2  ">
      <main className=" grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">
            {/* Business Info */}
            <Card className="sm:col-span-2">
              <CardHeader className="pb-3">
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  {business.name} <br />
                  {business.address} <br />
                  {business.phone} <br />
                  {business.email}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link to="">
                  <Button className="border bg-transparent border-primary text-primary hover:bg-primary hover:text-muted cursor-pointer">
                    Visit Company Website
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Current Clients */}
            <Card className="flex flex-col justify-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-stone-500">
                  Current Clients
                </CardTitle>
                <CardTitle className="text-6xl">
                  {clients && clients.length}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Total Invoices (all-time) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-stone-500">Total Invoices</CardTitle>
                <CardTitle className="text-6xl">
                  {invoices && invoices.length}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Total Revenue (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-blue-600">
                  Total Revenue of This Month
                </CardTitle>
                <CardTitle className="text-xl">R {totalRevenue}</CardTitle>
              </CardHeader>
            </Card>

            {/* Outstanding Revenue (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Outstanding Revenue of This Month
                </CardTitle>
                <CardTitle className="text-xl">
                  R {outstandingRevenue}
                </CardTitle>
              </CardHeader>
            </Card>
               {/* Paid Amount (current month) */}
            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-green-600">
                  Paid Amount of This Month
                </CardTitle>
                <CardTitle className="text-xl">
                  R {PaidAmount}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-stone-500">
                  Total Invoices of This Month
                </CardTitle>
                <CardTitle className="text-4xl">
                  R {totalInvoicesOfThisMonth}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Upcoming Due Dates (current month) */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-stone-500">
                Upcoming Due Dates of This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDueDates && upcomingDueDates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-3 py-2 border-b">Invoice #</th>
                        <th className="px-3 py-2 border-b">PO Number</th>
                        <th className="px-3 py-2 border-b">Due Date</th>
                        <th className="px-3 py-2 border-b">Amount</th>
                        <th className="px-3 py-2 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingDueDates.map((inv) => (
                        <tr
                          key={inv._id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewInvoice(inv._id)}
                        >
                          <td className="px-3 py-2 border-b">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-3 py-2 border-b">{inv.poNumber}</td>
                          <td className="px-3 py-2 border-b">
                            {new Date(inv.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 border-b">
                            R {inv.totalAmount}
                          </td>
                          <td className="px-3 py-2 border-b">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                inv.status === "Paid"
                                  ? "bg-green-100 text-green-600"
                                  : inv.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming invoices</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
