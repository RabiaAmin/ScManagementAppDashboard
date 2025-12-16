import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  addLoan,
  resetEmployeeLoan,
  clearEmployeeLoanErrors,
} from "@/store/slices/employeeLoanSlice";

function AddEmployeeLoan() {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const { loading, error, message } = useSelector((state) => state.employeeLoan);

  const [employeeId, setEmployeeId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentType, setRepaymentType] = useState("INSTALLMENT");
  const [emiAmount, setEmiAmount] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("");
  const [remarks, setRemarks] = useState("");



  // Auto-calculate total installments
  useEffect(() => {
    if (repaymentType === "INSTALLMENT" && loanAmount > 0 && emiAmount > 0) {
      setTotalInstallments(Math.ceil(Number(loanAmount) / Number(emiAmount)));
    } else {
      setTotalInstallments("");
    }
  }, [loanAmount, emiAmount, repaymentType]);

  // Submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      employee: employeeId,
      loanAmount,
      repaymentType,
      remarks,
    };

    if (repaymentType === "INSTALLMENT") {
      payload.emiAmount = emiAmount;
      payload.totalInstallments = totalInstallments;
    }

    dispatch(addLoan(payload));
  };

  // Toast notifications & reset form
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeLoanErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetEmployeeLoan());

      setEmployeeId("");
      setLoanAmount("");
      setRepaymentType("INSTALLMENT");
      setEmiAmount("");
      setTotalInstallments("");
      setRemarks("");
    }
  }, [dispatch, error, message]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6">
      <Card className="max-w-2xl mx-auto border border-stone-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-stone-800">
            Add Employee Loan
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className="grid gap-4">
            {/* Employee */}
            <div className="grid gap-2">
              <Label>Select Employee</Label>
              <select
                className="border border-stone-300 rounded-md p-2"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} — {emp.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Amount */}
            <div className="grid gap-2">
              <Label>Loan Amount</Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
              />
            </div>

            {/* Loan Type */}
            <div className="grid gap-2">
              <Label>Loan Type</Label>
              <select
                className="border border-stone-300 rounded-md p-2"
                value={repaymentType}
                onChange={(e) => setRepaymentType(e.target.value)}
              >
                <option value="INSTALLMENT">Installment (EMI)</option>
                <option value="MANUAL">Manual Payment</option>
              </select>
            </div>

            {/* EMI Fields */}
            {repaymentType === "INSTALLMENT" && (
              <>
                <div className="grid gap-2">
                  <Label>EMI Amount</Label>
                  <Input
                    type="number"
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Total Installments</Label>
                  <Input
                    type="number"
                    value={totalInstallments}
                    readOnly
                  />
                </div>
              </>
            )}

            {/* Remarks */}
            <div className="grid gap-2">
              <Label>Remarks</Label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional"
              />
            </div>

            {/* Submit */}
            <Button disabled={loading}>
              {loading ? "Saving..." : "Add Loan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddEmployeeLoan;
