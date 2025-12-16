import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SpecialLoadingBtn from "./SpecialLoadingBtn";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  addEmployee,
  resetEmployee,
  clearEmployeeErrors,

} from "@/store/slices/employeeSlice";

function AddEmployee() {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.employee);

  // ================= BASIC FIELDS =================
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [department, setDepartment] = useState("OTHER");

  const [payType, setPayType] = useState("TIME_BASED");
  const [employmentType, setEmploymentType] = useState("PERMANENT");

  const [weeklyPayment, setWeeklyPayment] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [dailyRate, setDailyRate] = useState("");

  const [perPieceRate, setPerPieceRate] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // ================= AUTO CALCULATION =================
  useEffect(() => {
    if (payType === "TIME_BASED" && weeklyPayment) {
      const WORKING_DAYS = 6;
      const WORKING_HOURS = 8;
      const totalHours = WORKING_DAYS * WORKING_HOURS;

      const hourly = (weeklyPayment / totalHours).toFixed(2);
      const daily = (weeklyPayment / WORKING_DAYS).toFixed(2);

      setHourlyRate(hourly);
      setDailyRate(daily);
    }
  }, [weeklyPayment, payType]);

  // ================= SUBMIT =================
  const addEmployeeHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("cnic", cnic);
    formData.append("department", department);
    formData.append("payType", payType);
    formData.append("employmentType", employmentType);
    formData.append("paymentMethod", paymentMethod);

    if (payType === "TIME_BASED") {
   
      formData.append("hourlyRate", hourlyRate);
      formData.append("dailyRate", dailyRate);
    }

    if (payType === "PIECE_RATE") {
      formData.append("perPieceRate", perPieceRate);
    }

    if (payType === "FIXED") {
      formData.append("monthlySalary", monthlySalary);
    }

    dispatch(addEmployee(formData));
  };

  // ================= EFFECTS =================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetEmployee());
     

      setName("");
      setPhone("");
      setCnic("");
      setDepartment("OTHER");
      setPayType("TIME_BASED");
      setEmploymentType("PERMANENT");
      setWeeklyPayment("");
      setHourlyRate("");
      setDailyRate("");
      setPerPieceRate("");
      setMonthlySalary("");
      setPaymentMethod("CASH");
    }
  }, [dispatch, error, message]);

  return (
    <div className="w-full">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Employee Information</h1>
          <p className="text-muted-foreground">Add New Employee Details</p>
        </div>

        <form onSubmit={addEmployeeHandler}>
          <div className="grid gap-4">

            {/* ================= TWO PER ROW ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>CNIC</Label>
                <Input value={cnic} onChange={(e) => setCnic(e.target.value)} />
              </div>

              <div>
                <Label>Department</Label>
                <select className="border rounded-md p-2 w-full" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="CLEANER">Cleaner</option>
                  <option value="CUTTER">Cutter</option>
                  <option value="STITCHER">Stitcher</option>
                  <option value="QA">QA</option>
                  <option value="IT">IT</option>
                  <option value="FINANCE">Finance</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employment Type</Label>
                <select className="border rounded-md p-2 w-full" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                  <option value="PERMANENT">Permanent</option>
                  <option value="TEMP">Temporary</option>
                </select>
              </div>

              <div>
                <Label>Pay Type</Label>
                <select className="border rounded-md p-2 w-full" value={payType} onChange={(e) => setPayType(e.target.value)}>
                  <option value="TIME_BASED">Time Based</option>
                  <option value="PIECE_RATE">Piece Rate</option>
                  <option value="FIXED">Fixed Salary</option>
                </select>
              </div>
            </div>

            {/* ================= TIME BASED ================= */}
            {payType === "TIME_BASED" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Weekly Payment</Label>
                  <Input
                    type="number"
                    value={weeklyPayment}
                    onChange={(e) => setWeeklyPayment(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Hourly Rate (Auto)</Label>
                  <Input value={hourlyRate} disabled />
                </div>

                <div>
                  <Label>Daily Rate (Auto)</Label>
                  <Input value={dailyRate} disabled />
                </div>
              </div>
            )}

            {/* ================= PIECE RATE ================= */}
            {payType === "PIECE_RATE" && (
              <div>
                <Label>Per Piece Rate</Label>
                <Input type="number" value={perPieceRate} onChange={(e) => setPerPieceRate(e.target.value)} />
              </div>
            )}

            {/* ================= FIXED ================= */}
            {payType === "FIXED" && (
              <div>
                <Label>Monthly Salary</Label>
                <Input type="number" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} />
              </div>
            )}

            {/* ================= PAYMENT METHOD ================= */}
            <div>
              <Label>Payment Method</Label>
              <select className="border rounded-md p-2 w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
                <option value="CARD">Card</option>
              </select>
            </div>

            {/* ================= SUBMIT ================= */}
            <div className="mb-8">
              {!loading ? (
                <Button className="w-full" type="submit">
                  Add Employee
                </Button>
              ) : (
                <SpecialLoadingBtn />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
