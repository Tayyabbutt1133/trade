"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fonts } from "@/components/ui/font"
// import Link from "next/link"
import { SocialSignInButtons } from "./SocialSignInButtons"
import { LOGIN } from "@/app/actions/signin"
import { useRouter } from "next/navigation"
import roleAccessStore from "@/store/role-access-permission"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const router = useRouter()

  const setRole = roleAccessStore((state)=>state.setRole)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset messages before every attempt
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const loginToSubmit = new FormData(e.target);
      const server_response = await LOGIN(loginToSubmit);
  
      console.log("Server Response:", server_response);
  
      if (server_response.success) {
        setSuccessMessage("Login Successfully");
  
        setRole({
          id: server_response.data.id,
          type: server_response.data.type.toLowerCase(),
        });
  
        // Redirect after a delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        // Set the error message from the server response
        setErrorMessage(server_response.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };
  
  return (
    <div className={`space-y-6 ${fonts.montserrat}`}>
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
          <Button type="submit" className="w-full mt-4 bg-[#37bfb1] hover:bg-[#2ea89b]">
            Sign In
          </Button>
        </div>
        <div className="text-sm text-center mt-4">
          <span className="text-[#37bfb1] hover:text-[#2ea89b] cursor-pointer">
            Reset password
          </span>
        </div>
      </form>

      {/* Display success or error messages */}
      {successMessage && (
        <div className="text-green-600 text-center mt-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4">
          {errorMessage}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <SocialSignInButtons />
    </div>
  )
}
