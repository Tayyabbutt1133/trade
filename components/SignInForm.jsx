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

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset messages for each attempt
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Create FormData from the form element
      const loginToSubmit = new FormData(e.target)
      const server_response = await LOGIN(loginToSubmit)
      console.log("Server Response : ", server_response)
      
      // Adjust the condition based on your API's response structure.
      // For example, if a successful response always includes an "id" property:
      if (server_response?.id) {
        setSuccessMessage("Login Successfully")
        // Optionally delay the redirect so the user can see the message.
        setTimeout(() => {
          // now based on type we are getting from response->it will route
          router.push(`/dashboard/${server_response.type.toLowerCase()}`)
        }, 1000)
      } else {
        setErrorMessage("Invalid login credentials. Please try again!")
      }
      
    } catch (error) {
      setErrorMessage("An error occurred while processing your login. Please try again later.")
      console.error("Login error:", error)
    }
  }

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
