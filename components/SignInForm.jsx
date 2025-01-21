"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fonts } from "@/components/ui/font"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log("Sign in:", { email, password })
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${fonts.montserrat}`}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-[#37bfb1] hover:bg-[#2ea89b]">
        Sign In
      </Button>
      <div className="text-sm text-center mt-4">
        <span className="text-[#37bfb1] hover:text-[#2ea89b] cursor-pointer">Reset password</span>
      </div>
    </form>
  )
}

