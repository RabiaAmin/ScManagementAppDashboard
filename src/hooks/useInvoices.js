// src/hooks/useInvoices.js
import { useMemo } from "react";

export const useInvoices = (invoices) => {
  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter invoices for current month
    const currentMonthInvoices =
      invoices?.filter((inv) => {
        const invDate = new Date(inv.date);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
      }) || [];

    // Calculate total revenue (rounded to 2 decimals)
    const totalRevenue = Number(
      currentMonthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toFixed(2)
    );

    // Calculate outstanding revenue (rounded to 2 decimals)
    const outstandingRevenue = Number(
      currentMonthInvoices
        .filter((inv) => inv.status !== "Paid")
        .reduce((sum, inv) => sum + inv.totalAmount, 0)
        .toFixed(2)
    );

       // Calculate Paid Amount (rounded to 2 decimals)
    const PaidAmount = Number(
      currentMonthInvoices
        .filter((inv) => inv.status === "Paid")
        .reduce((sum, inv) => sum + inv.totalAmount, 0)
        .toFixed(2)
    );

    // Upcoming due dates (unpaid, sorted)
    const upcomingDueDates = currentMonthInvoices
      .filter((inv) => inv.status !== "Paid")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalInvoicesOfThisMonth = currentMonthInvoices.length;

    return {
      currentMonthInvoices,
      totalRevenue,
      outstandingRevenue,
      upcomingDueDates,
      totalInvoicesOfThisMonth,
      PaidAmount
    };
  }, [invoices]);
};
