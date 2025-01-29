"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fonts } from "@/components/ui/font"
import { CustomRadio } from "./CustomRadio"
import { useRouter } from "next/navigation"
import { SocialSignInButtons } from "./SocialSignInButtons"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [userType, setUserType] = useState("buyer")
  const [errors, setErrors] = useState({})
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
  }

  const validateForm = (formData) => {
    let errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required'
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm(formData)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    console.log("Sign up:", { ...formData, userType })
    router.push("/dashboard")
  }

  const formFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
    { id: "confirmPassword", label: "Confirm Password", type: "password" },
  ]

  return (
    <div className={`space-y-6 ${fonts.montserrat}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full px-3 py-2 border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#37bfb1]`}
            />
            {errors[field.id] && <div className="text-red-500 text-sm">{errors[field.id]}</div>}
          </div>
        ))}
        <Button
          type="submit"
          className="w-full mt-4 bg-[#37bfb1] hover:bg-[#2ea89b] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Sign Up
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <SocialSignInButtons />
    </div>
  )
}