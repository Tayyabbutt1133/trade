"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fonts } from "@/components/ui/font"
import { CustomRadio } from "./CustomRadio"
import Link from "next/link"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [userType, setUserType] = useState("buyer")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log("Sign up:", { ...formData, userType })
  }

  const formFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
    { id: "confirmPassword", label: "Confirm Password", type: "password" },
  ]

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${fonts.montserrat}`}>
      <div className="space-y-4">
        <Label className="text-lg font-semibold">I am registering as a:</Label>
        <CustomRadio
          options={[
            { value: "buyer", label: "Buyer" },
            { value: "seller", label: "Seller" },
          ]}
          name="userType"
          defaultValue="buyer"
          onChange={(value) => setUserType(value)}
        />
      </div>


      {formFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="text-sm font-medium">
            {field.label}
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            value={formData[field.id]}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#37bfb1]"
          />
        </div>
      ))}
      <Link  href={'/dashboard'}>
      <Button
        type="submit"
        className="w-full mt-4 bg-[#37bfb1] hover:bg-[#2ea89b] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
      >
        Sign Up
        </Button>
        </Link>
    </form>
  )
}

