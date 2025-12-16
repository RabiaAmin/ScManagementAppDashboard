import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {

  deleteEmployee,
  clearEmployeeErrors,
  resetEmployee,
} from "@/store/slices/employeeSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AllEmployess() {
  const dispatch = useDispatch();

  const { employees, loading, message, error } = useSelector(
    (state) => state.employee
  );


  // ================= DELETE =================
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  // ================= TOASTS =================
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEmployeeErrors());
    }

    if (message) {
      toast.success(message);
      dispatch(resetEmployee());
    }
  }, [error, message, dispatch]);

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 space-y-6">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">
          Total Employees:{" "}
          <span className="text-primary font-bold">{employees.length}</span>
        </h2>
      </div>

      {/* ================= CARD ================= */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-stone-800">
            Employee List
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              No employees found.
            </p>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg border border-stone-200">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Pay Type</TableHead>
                    <TableHead>Employment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {employees?.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.payType}</TableCell>
                      <TableCell>{employee.employmentType}</TableCell>
                      <TableCell>{employee.status}</TableCell>
                      <TableCell>{employee.paymentMethod}</TableCell>

                      {/* ================= ACTIONS ================= */}
                      <TableCell className="flex justify-center gap-2">
                       
                        <Link to={`/employee/update/${employee._id}`}>
                          <Button size="icon" variant="ghost">
                            <Pencil className="w-5 h-5 text-green-600" />
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(employee._id)}
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

export default AllEmployess;
