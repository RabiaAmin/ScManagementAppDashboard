import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoansByEmployee,
  clearEmployeeLoanErrors,
} from "@/store/slices/employeeLoanSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { usePdfDownloader } from "@/hooks/useDownloadPdf";
import SpecialLoadingBtn from "./SpecialLoadingBtn";

function EmployeeLoanPage() {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const {
    loansByEmployee,
    employee,
    totalLoans,
    totalLoanAmount,
    totalPaidAmount,
    loading,
    error,
  } = useSelector((state) => state.employeeLoan);
  const { isDownloading, handlePdfDownload } = usePdfDownloader();
  const printRef = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?._id || "");



  useEffect(() => {
    if (selectedEmployee) {
      dispatch(getLoansByEmployee(selectedEmployee));
    }
  }, [dispatch, selectedEmployee]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeLoanErrors());
    }
  }, [error, dispatch]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 space-y-6">
      <div className="flex justify-between">
        <div className="w-full mb-4">
          <label className="block font-semibold mb-2">Select Employee</label>
          <select
            className="border border-stone-300 rounded-md p-2 w-full max-w-sm"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} — {emp.department}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full max-w-6xl p-6 flex justify-end mb-6">
          {isDownloading ? (
            <SpecialLoadingBtn />
          ) : (
            <Button
              disabled={isDownloading}
              onClick={() => handlePdfDownload(printRef, `loan_summary_Report`)}
            >
              Download PDF
            </Button>
          )}
        </div>
      </div>
      <Card ref={printRef} className="w-full shadow-none border-none rounded-none pdf-print">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-stone-800">
            {employee.name} Loans Summary Report
          </CardTitle>
          <p className="text-[0.8rem]">
            <strong>Total Loans:</strong> {totalLoans}
            <br /> <strong>Total Loan Amount: R</strong> {totalLoanAmount}
            <br /> <strong>Total Paid Amount: R</strong> {totalPaidAmount}
          </p>
        </CardHeader>

        <CardContent>
          {/* Loan Table */}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-stone-600" />
            </div>
          ) : loansByEmployee?.length === 0 ? (
            <p className="text-center text-stone-500 py-6">
              No loans found for this employee.
            </p>
          ) : (
            <div className="overflow-x-auto  border-none ">
              <Table className="min-w-[90%]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Repayment Type</TableHead>
                    <TableHead>EMI Amount</TableHead>
                    <TableHead>Total Installments</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Remaining Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loansByEmployee?.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell>R {loan.loanAmount}</TableCell>
                      <TableCell>{loan.repaymentType}</TableCell>
                      <TableCell>{loan.emiAmount || "—"}</TableCell>
                      <TableCell>{loan.totalInstallments || "—"}</TableCell>
                      <TableCell>R {loan.paidAmount}</TableCell>
                      <TableCell>R {loan.remainingAmount}</TableCell>
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

export default EmployeeLoanPage;

