import {
  deleteBankAccount,
  getAllBankAccount,
} from "@/store/slices/bankAccountSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Loader from "@/components/Loader";

function BankAccount() {
  const { loading, bankAccounts } = useSelector((state) => state.BankAccount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllBankAccount());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteBankAccount(id));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full p-6">
      <div className="grid gap-6">
        {/* Page Header */}
        <div className="md:flex justify-between flex-col">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-200">
              All Bank Accounts
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Manage, update, or remove Account records from the list below.
            </p>
          </div>

          <div className="">
            <Link to={`/addAccount`}>
              <Button
                variant="secondary"
                className="w-full sm:w-auto bg-stone-700 hover:bg-stone-800 text-white mt-4"
              >
                Add New Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Client Cards */}
        {bankAccounts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => (
              <Card
                key={account._id}
                className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg text-stone-800 dark:text-stone-100">
                    {account.bankName}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-1 text-sm text-stone-700 dark:text-stone-300">
                  <p>
                    <strong>Account Holder Name:</strong>{" "}
                    {account.accountHolderName || "N/A"}
                  </p>
                  <p>
                    <strong>Account Number:</strong>{" "}
                    {account.accountNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Branch Code:</strong> {account.branchCode || "N/A"}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between mt-2">
              
                  <Button
                    variant="destructive"
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDelete(account._id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-stone-600 dark:text-stone-400 text-lg">
            No Account found. Add some Account first.
          </p>
        )}
      </div>
    </div>
  );
}

export default BankAccount;
