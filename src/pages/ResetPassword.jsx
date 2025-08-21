import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import SpecialLoadinBtn from "@/pages/components/specialLoadingBtn";
import {
  clearAllForgotPasswordErrors,
  resetPassword,
} from "@/store/slices/forgotResetPasswordSlice";
import { getUser } from "@/store/slices/userSlice";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleResetPassword = () => {
    dispatch(resetPassword(token, password, confirmPassword));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotPasswordErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
    if (message !== null) {
      toast.success(message);
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated, error, message, navigateTo]);

  return (
    <div className="w-[100dvw] h-[100vh] bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="shadow-lg border-stone-200 bg-stone-100">
            <CardContent className="p-0">
              <form
                className="w-full p-6 md:p-8"
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleResetPassword();
                }}
              >
                <div className="flex flex-col gap-6">
                  {/* Title and Subtitle */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold text-stone-800">
                      Reset Password
                    </h1>
                    <p className="text-stone-600 text-sm">
                      Enter your new password to regain access
                    </p>
                  </div>

                  {/* New Password */}
                  <div className="grid gap-3">
                    <Label htmlFor="password" className="text-stone-700">
                      New Password
                    </Label>
                    <Input
                      name="password"
                      value={password}
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="bg-stone-50 border-stone-300"
                    />
                  </div>

                  {/* Confirm New Password */}
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword" className="text-stone-700">
                      Confirm New Password
                    </Label>
                    <Input
                      name="confirmPassword"
                      value={confirmPassword}
                      type="password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="bg-stone-50 border-stone-300"
                    />
                  </div>

                  {/* Back to Login */}
                  <div className="flex items-center justify-end">
                    <Link
                      to="/login"
                      className="text-sm text-stone-600 hover:text-stone-800 underline-offset-2 hover:underline"
                    >
                      Remember your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  {loading ? (
                    <SpecialLoadinBtn content="Resetting..." />
                  ) : (
                    <Button
                      type="submit"
                      className="w-full bg-stone-700 hover:bg-stone-800 text-white"
                    >
                      Reset Password
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Terms and Privacy */}
          <div className="text-center text-xs text-stone-600">
            By clicking continue, you agree to our{" "}
            <a href="#terms" className="underline hover:text-stone-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#policy" className="underline hover:text-stone-800">
              Privacy Policy
            </a>.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
