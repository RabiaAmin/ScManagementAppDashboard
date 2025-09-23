import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import SpecialLoadingBtn from "./components/SpecialLoadingBtn"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login(email, password));
  }

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }

    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, error, loading]);

  return (
    <div className="w-[100dvw] h-[100vh] ">
      <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-stone-200 bg-stone-100">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight text-stone-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-stone-600">
              Sign in with your email and password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="grid gap-6" onSubmit={onSubmit} method="post">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-stone-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500"
                    aria-hidden
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="pl-9 bg-stone-50 border-stone-300"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-stone-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pl-9 pr-10 bg-stone-50 border-stone-300"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2  rounded-md hover:bg-stone-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-stone-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-stone-600" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/password/forgot"
                    className="text-stone-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {loading ? (
                <SpecialLoadingBtn />
              ) : (
                <Button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800"
                >
                  <LogIn className="h-4 w-4" />
                  LogIn
                </Button>
              )}
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 text-center text-sm text-stone-600">
            <p>Use a valid account to access your dashboard.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Login;
