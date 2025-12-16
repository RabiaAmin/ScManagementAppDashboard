import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {

  deleteLoan,
  payLoanEmi,
  payManualLoanAmount,
  clearEmployeeLoanErrors,
  resetEmployeeLoan,
} from "@/store/slices/employeeLoanSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Loader2, Trash2, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

function AllEmployeeLoans() {
  const dispatch = useDispatch();
  const { allLoans, loading, error, message } = useSelector(
    (state) => state.employeeLoan
  );

  const [payAmount, setPayAmount] = useState({});
  const [payingId, setPayingId] = useState(null);



  // ================= PAY =================
  const handlePay = (loanId) => {
    const amount = Number(payAmount[loanId]);
    if (!amount || amount <= 0) {
      return toast.error("Enter valid amount");
    }

    dispatch(payLoanEmi({ id: loanId, amount }));
    setPayingId(null);
  };

  const handleManualPay = (loanId) => {
  const amount = Number(payAmount[loanId]);
  if (!amount || amount <= 0) return toast.error("Enter valid amount");

  dispatch(payManualLoanAmount({ loanId, amount, method: "CASH", note: "Manual Payment" }));
  setPayingId(null);
};

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (window.confirm("Delete this loan permanently?")) {
      dispatch(deleteLoan(id));
    }
  };

  // ================= TOAST =================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeLoanErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetEmployeeLoan());
    }
  }, [dispatch, error, message]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 space-y-6">
      <Card className="shadow-md border border-stone-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stone-800">
            Employee Loan Management
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-stone-600" />
            </div>
          ) : allLoans?.length === 0 ? (
            <p className="text-center text-stone-500 py-6">
              No employee loans found.
            </p>
          ) : (
            <div className="border border-stone-200 rounded-lg overflow-x-auto">
              <Table className="min-w-[90%]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Loan</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Installments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {allLoans?.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell className="font-semibold">
                        {loan.employee?.name}
                      </TableCell>

                      <TableCell>R {loan.loanAmount}</TableCell>
                      <TableCell>R {loan.paidAmount}</TableCell>
                      <TableCell>R {loan.remainingAmount}</TableCell>

                      <TableCell>
                        {loan.totalInstallments
                          ? `${loan.paidInstallments}/${loan.totalInstallments}`
                          : "—"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            loan.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </TableCell>

                      {/* ================= ACTIONS ================= */}
                      <TableCell className="flex items-center justify-center gap-2">
                        {loan.status === "Active" && (
                          <>
                            {loan.repaymentType === "INSTALLMENT" ? (
                              payingId === loan._id ? (
                                <>
                                  <Input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-24"
                                    value={payAmount[loan._id] || ""}
                                    onChange={(e) =>
                                      setPayAmount({
                                        ...payAmount,
                                        [loan._id]: e.target.value,
                                      })
                                    }
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handlePay(loan._id)}
                                  >
                                    Pay
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setPayingId(loan._id)}
                                >
                                  <DollarSign className="w-5 h-5 text-green-600" />
                                </Button>
                              )
                            ) : (
                              // Manual Payment Button
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleManualPay(loan._id)}
                              >
                                Manual Pay
                              </Button>
                            )}
                          </>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(loan._id)}
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AllEmployeeLoans;