"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fonts } from "@/components/ui/font";
import { SocialSignInButtons } from "./SocialSignInButtons";
import { LOGIN } from "@/app/actions/signin";
import { useRouter } from "next/navigation";
import roleAccessStore from "@/store/role-access-permission";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setRole = roleAccessStore((state) => state.setRole);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages before every attempt
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const loginToSubmit = new FormData(e.target);
      // calling server side login function
      const server_response = await LOGIN(loginToSubmit);
      console.log("Response from Server : ", server_response);
      setLoading(false);

      if (server_response.success) {
        setSuccessMessage("Login successful!");

        // Validate the response before using its properties
        if (
          server_response.data &&
          server_response.data.id &&
          server_response.data.type &&
          typeof server_response.data.type === "string"
        ) {
          // Safely convert the role type to lowercase
          const roleType = server_response.data.type.toLowerCase();
          console.log(roleType);
          setRole({
            id: server_response.data.id,
            type: roleType,
          });
        } else {
          setErrorMessage("Invalid server response: Missing user information.");
          return;
        }

        window.location.href = "/";
      } else {
        // Display the error message provided by the server (or a fallback message)
        setErrorMessage(
          server_response.message || "Login failed. Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className={`px-4 ${fonts.montserrat}`}>
      <div className="space-y-6 w-96 ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#37bfb1] hover:bg-[#2ea89b]"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
          <div className="text-sm text-center mt-4">
            <span className="text-[#37bfb1] hover:text-[#2ea89b] cursor-pointer">
              Reset password
            </span>
          </div>
        </form>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="text-green-600 text-center mt-4 max-w-sm mx-auto break-words">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4 max-w-sm mx-auto break-words">
          {errorMessage}
        </div>
      )}

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>

      {/* <SocialSignInButtons /> */}
    </div>
  );
}
