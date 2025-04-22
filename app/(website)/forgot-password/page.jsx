// Client Component - app/forgot-password/page.js
"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FORGOTPASS } from "@/app/actions/forgotemail_code";
import {useEmailStore, useVerificationStore} from '../../../store/user-email'

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  
  // Use email from Zustand store
  const { email, setEmail } = useEmailStore();
  const { code, setCode } = useVerificationStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Call the FORGOTPASS server action
      const response = await FORGOTPASS(email);
      console.log("response from forgot password:", response);
      const verification_code = response?.Password?.[0]?.code
      if (verification_code) {
        setCode(verification_code);
      }
      
      // Check response status
      if (response.Response === 'Email not registered') {
        setError(response.message || "Failed to send reset link or Maybe Email Not Registered. Please try again.");
      } else {
        // Store email in Zustand store for access in next page
        setEmail(email);
        setSuccess(true);
        // Optional: redirect after short delay
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md my-16">
          <CardHeader className="space-y-1 bg-green-600 text-white">
            <CardTitle className="text-2xl font-bold">Email Sent</CardTitle>
            <CardDescription className="text-gray-100">
              We've sent a password reset code to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center mb-4">
              Please check your inbox at <strong>{email}</strong> and follow the instructions.
            </p>
            <p className="text-xs text-gray-500 text-center">
              Redirecting you to the reset page...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/signin">
              <Button variant="outline">Return to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md my-16">
        <CardHeader className="space-y-1 bg-[#3cbfb1] text-white">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-gray-100">
            Enter your email address to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  We'll send a password reset code to this email
                </p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-[#3cbfb1] hover:bg-[#35a99c]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Proceed"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/signin" className="text-[#3cbfb1] hover:underline text-sm">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}