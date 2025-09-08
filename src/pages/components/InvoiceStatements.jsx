import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BACKEND_URL_INVOICE;
function InvoiceStatements() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const getWeekRange = () => {
    const now = new Date();

    // Move to last week
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const dayOfWeek = lastWeek.getDay(); // 0 = Sunday
    const first = new Date(lastWeek);
    first.setDate(lastWeek.getDate() - dayOfWeek); // Sunday of last week
    const last = new Date(first);
    last.setDate(first.getDate() + 6); // Saturday of last week

    const startDate = first.toISOString().split("T")[0]; // YYYY-MM-DD
    const endDate = last.toISOString().split("T")[0]; // YYYY-MM-DD

    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const { startDate, endDate } = getWeekRange();
        const res = await axios.get(
          `${BASE_URL}/weekly-statements?startDate=${startDate}&endDate=${endDate}&_=${new Date().getTime()}`,
          { withCredentials: true }
        );
        const data = res.data.statements;

        setStatements(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch weekly statements"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, []);

  if (loading)
    return <p className="text-center">Loading weekly statements...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Weekly Invoice Statements</h2>
      {statements.length === 0 ? (
        <p>No invoices found for this week.</p>
      ) : (
        <div className="space-y-6">
          {statements.map((invoice) => (
            <div
              key={invoice._id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-lg transition"
            >
              {
                invoice.invoices ? (
                   <Link to={`/statements`} state={invoice}>
                {" "}
                {/* Pass clientId to route */}
                <h3 className="text-xl font-semibold">{invoice._id}</h3>
                <p>Total Invoices: {invoice.totalInvoices}</p>
                <p>Total Amount: R {invoice.totalAmount.toFixed(2)}</p>
              </Link>
                ) : (
                  <div> data is not available </div>
                )
              }
             
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvoiceStatements;
