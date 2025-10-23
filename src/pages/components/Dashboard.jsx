import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAllInvoicesOFThisMonth } from "@/store/slices/invoiceSlice";
import { Input } from "@/components/ui/input";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { getAllExpenses } from "@/store/slices/expenseSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const { business } = useSelector((state) => state.business);
  const { clients } = useSelector((state) => state.client);
  const { loading, stats, totalRecords } = useSelector(
    (state) => state.invoice
  );
  const { ExpenseStats } = useSelector((state) => state.expense);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearch, setIsSearch] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

    const formatLocalDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatLocalDate(startDate));
    setEndDate(formatLocalDate(endDate));
    fetchInvoices(startDate, endDate);
  }, []);

  const fetchInvoices = (startDate, endDate) => {
    setLoadingSearch(true);
    const page = 1;
    const limit = 40;
    dispatch(getAllInvoicesOFThisMonth(page, limit, startDate, endDate));
    dispatch(getAllExpenses(startDate, endDate));

    setTimeout(() => {
      setLoadingSearch(false);
    }, 2000);
   
  };

  if (loading && !business && !clients) return <Loader />;

  return (
    <div className="flex flex-col p-4">
      {/* Business Info */}
      <section className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Business Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              {business?.name} <br />
              {business?.address} <br />
              {business?.phone} <br />
              {business?.email}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="">
              <Button className="border bg-transparent border-primary text-primary hover:bg-primary hover:text-white">
                Visit Company Website
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      <div className=" lg:flex md:flex-row  flex-col gap-3  justify-end mb-6">
        <div>
          <label className="text-gray-500 text-sm">Start Date</label>
          <Input
            type="date"
            className="bg-gray-100"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setIsSearch(false);
            }}
          />
        </div>
        <div>
          <label className="text-gray-500 text-sm">End Date</label>
          <Input
            type="date"
            className="bg-gray-100"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex items-end md:my-0 my-2">
          {loadingSearch ? (
            <SpecialLoadingBtn />
          ) : (
            <Button
              disabled={isSearch}
              onClick={() => fetchInvoices(startDate, endDate)}
            >
              Search
            </Button>
          )}
        </div>
      </div>

      {/* INVOICE STATS SECTION */}
      <section>
        <h2 className="text-2xl font-semibold mb-3 text-primary">
          Invoice Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <StatCard
            title="Active Clients"
            value={clients?.length}
            color="text-stone-600"
          />
          <StatCard
            title="Total Invoices"
            value={totalRecords}
            color="text-stone-600"
          />
          <StatCard
            title="Total Revenue"
            value={`R ${stats.totalRevenue}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-blue-600"
          />
          <StatCard
            title="Outstanding Revenue"
            value={`R ${stats.outstandingRevenue}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-orange-600"
          />
          <StatCard
            title="Paid Amount"
            value={`R ${stats.PaidAmount}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-green-600"
          />
          <StatCard
            title="Total Invoices (Month)"
            value={`R ${stats.totalInvoicesOfThisMonth}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-yellow-600"
          />
          <StatCard
            title="Collected VAT"
            value={`R ${stats.collectedVAT}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-purple-600"
          />
          <StatCard
            title="Net Revenue"
            value={`R ${stats.netRevenue}`}
            subtitle={
              stats.startDate &&
              `${new Date(stats.startDate).toLocaleDateString()} - ${new Date(
                stats.endDate
              ).toLocaleDateString()}`
            }
            color="text-emerald-600"
          />
        </div>
      </section>

      {/* EXPENSE STATS SECTION */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3 text-primary">
          Expense Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <StatCard
            title="Expense Count"
            value={ExpenseStats.expenseCount}
            color="text-stone-700"
          />
          <StatCard
            title="Total Expense"
            value={`R ${ExpenseStats.totalExpense}`}
            subtitle={
              ExpenseStats.startDate &&
              `${new Date(
                ExpenseStats.startDate
              ).toLocaleDateString()} - ${new Date(
                ExpenseStats.endDate
              ).toLocaleDateString()}`
            }
            color="text-red-600"
          />
          <StatCard
            title="VAT Expense"
            value={`R ${ExpenseStats.totalVatExpense}`}
            subtitle={
              ExpenseStats.startDate &&
              `${new Date(
                ExpenseStats.startDate
              ).toLocaleDateString()} - ${new Date(
                ExpenseStats.endDate
              ).toLocaleDateString()}`
            }
            color="text-blue-600"
          />
          <StatCard
            title="Non-VAT Expense"
            value={`R ${ExpenseStats.totalNonVatExpense}`}
            subtitle={
              ExpenseStats.startDate &&
              `${new Date(
                ExpenseStats.startDate
              ).toLocaleDateString()} - ${new Date(
                ExpenseStats.endDate
              ).toLocaleDateString()}`
            }
            color="text-orange-600"
          />
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value, subtitle, color }) => {
  // Helper to format large numbers with compact style
  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === "") return "R 0";

    // Extract numeric part if value is a string like "R 12345"
    const num = parseFloat(val.toString().replace(/[^\d.-]/g, ""));
    if (isNaN(num)) return val;

    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      notation: "compact", // <-- Compact style (K, M, B)
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Card className="flex flex-col justify-center shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className={`${color} text-base font-medium`}>
          {title}
        </CardTitle>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        <CardTitle className="text-2xl font-bold mt-2">
          {formatCurrency(value)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Dashboard;
