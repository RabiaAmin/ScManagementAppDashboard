import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  addBankAccount,
  clearAllErrors,
  resetBankAccount,

} from "@/store/slices/bankAccountSlice";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import SpecialLoadingBtn from './SpecialLoadingBtn';

function AddAccount() {
  const { loading, error, message } = useSelector((state) => state.BankAccount);
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderaName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");

  const addAccountHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("accountType", accountType);
    formData.append("bankName", bankName);
    formData.append("accountHolderName", accountHolderName);
    formData.append("accountNumber", accountNumber);
    formData.append("branchCode", branchCode);
    dispatch(addBankAccount(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetBankAccount());
      setAccountType("");
      setBankName("");
      setAccountHolderaName("");
      setAccountNumber("");
      setBranchCode("");
    }
  }, [dispatch, error, message]);

  return (
    <div className="w-full h-[100vh] p-6 bg-stone-50 dark:bg-stone-900 ">
      <div className="grid gap-6 max-w-2xl mx-auto mt-4">
        {/* Heading */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
            Add New Bank Account
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Fill in the account details carefully below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={addAccountHandler} className="grid gap-5 bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
          <div className="grid gap-3">
            <Label className="text-stone-700 dark:text-stone-300">Account Type</Label>
            <Input
              type="text"
              placeholder="e.g. VAT or Non-VAT"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-stone-400"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-stone-700 dark:text-stone-300">Bank Name</Label>
            <Input
              type="text"
              placeholder="e.g. FNB, Standard Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-stone-400"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-stone-700 dark:text-stone-300">Account Holder Name</Label>
            <Input
              type="text"
              placeholder="Account holder full name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderaName(e.target.value)}
              className="bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-stone-400"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-stone-700 dark:text-stone-300">Account Number</Label>
            <Input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-stone-400"
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-stone-700 dark:text-stone-300">Branch Code</Label>
            <Input
              type="text"
              placeholder="Enter branch code"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600 focus:ring-stone-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {!loading ? (
              <Button
                type="submit"
                className="w-full bg-stone-700 hover:bg-stone-800 text-white font-semibold rounded-xl transition-all"
              >
                Add Account
              </Button>
            ) : (
              <SpecialLoadingBtn content="Adding..." />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAccount;
