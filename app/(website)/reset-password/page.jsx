"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEmailStore, useVerificationStore } from "../../../store/user-email";
import { RESETPASS } from "@/app/actions/reset_password";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { email } = useEmailStore();
  const { code } = useVerificationStore();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.verificationCode.trim()) {
      setError("Verification code is required");
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.verificationCode !== code) {
      setError("Verification code is incorrect");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("userid", 0);
      payload.append("email", email);
      payload.append("password", formData.newPassword);

      const res = await RESETPASS(payload);
      // console.log("response from reset password:", res);
      const success = res?.Password?.[0]?.body === "Success";

      if (success) {
        setIsSubmitted(true);
        setSuccessMessage("Your password has been reset successfully!");

        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError(res.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 bg-[#3cbfb1] text-white">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </CardHeader>

        {!isSubmitted ? (
          <>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-red-300 bg-red-50 text-red-800"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert
                      variant="default"
                      className="border-green-300 bg-green-50 text-green-800"
                    >
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* Verification Code */}
                  <div className="space-y-2">
                    <label
                      htmlFor="verificationCode"
                      className="text-sm font-medium"
                    >
                      Verification Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        placeholder="Enter code"
                        className="pl-10"
                        value={formData.verificationCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="text-sm font-medium"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => togglePasswordVisibility("password")}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <KeyRound className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#3cbfb1] hover:bg-[#35a99c]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
              <div className="text-center text-sm">
                <Link href="/signin" className="text-[#3cbfb1] hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </>
        ) : (
          <CardContent className="pt-6 pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-[#3cbfb1]" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">
              Password Reset Successful
            </h3>
            <p className="mb-4 text-gray-600">
              Your password has been reset successfully.
            </p>
            <Button
              className="w-full bg-[#3cbfb1] hover:bg-[#35a99c]"
              onClick={() => router.push("/signin")}
            >
              Back to login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
