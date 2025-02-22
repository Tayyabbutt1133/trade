"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fonts } from "@/components/ui/font"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomRadio } from "./CustomRadio"
import { useRouter } from "next/navigation"
// import { SocialSignInButtons } from "./SocialSignInButtons";
import { Register } from "@/app/actions/signup"
import roleAccessStore from "@/store/role-access-permission"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    "company-name": "",
    address: "",
    password: "",
    confirmPassword: "",
    type: "",
    country: "",
    industry: "",
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countries, setCountries] = useState([])
  const [industries, setIndustries] = useState([])
  const [apiError, setApiError] = useState(false)

  const setRole = roleAccessStore((state) => state.setRole)
  const router = useRouter()

  useEffect(() => {
    // Updated fetchData function within useEffect
    const fetchData = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        // Country fetch
        const countryResponse = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country/", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (countryResponse.ok) {
          const countryData = await countryResponse.json()
          setCountries(countryData.Country || [])
        } else {
          console.warn("Country API error:", countryResponse.status)
          setApiError(true)
        }
      } catch (error) {
        console.error("Fetch error:", error)
        setApiError(true)
        if (error.name === "AbortError") {
          console.warn("Country request timed out")
        }
      }

      // Repeat similar pattern for industry fetch
      const industryController = new AbortController()
      const industryTimeout = setTimeout(() => industryController.abort(), 5000)

      try {
        const industryResponse = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry/", {
          signal: industryController.signal,
        })

        clearTimeout(industryTimeout)

        if (industryResponse.ok) {
          const industryData = await industryResponse.json()
          setIndustries(industryData.Industry || [])
        } else {
          console.warn("Industry API error:", industryResponse.status)
          setApiError(true)
        }
      } catch (error) {
        console.error("Fetch error:", error)
        setApiError(true)
        if (error.name === "AbortError") {
          console.warn("Industry request timed out")
        }
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")
    setIsSubmitting(true)

    const formErrors = validateForm(formData)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsSubmitting(false)
      return
    }

    const formDataToSubmit = new FormData(e.target)
    formDataToSubmit.delete("confirmPassword")

    try {
      const result = await Register(formDataToSubmit)
      console.log(result)
      if (result.success) {
        setSuccessMessage("Registration successful! Redirecting...")

        // Setting id and user type on global state file-->zustand
        setRole({
          id: result.data?.id || "",
          type: result.data?.type || "",
          registerstatus: result.data?.status || "",
        })

        router.push(`/`)
      } else {
        setErrors({ server: result.error || "An unknown error occurred" })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ server: "Something went wrong. Please try again later." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = (data) => {
    const errors = {}
    if (!data.name.trim()) errors.name = "Name is required"
    else if (data.name.length < 2) errors.name = "Name must be at least 2 characters"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email) errors.email = "Email is required"
    else if (!emailRegex.test(data.email)) errors.email = "Invalid email format"

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!data.password) errors.password = "Password is required"
    else if (!passwordRegex.test(data.password))
      errors.password =
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character"

    if (!data.confirmPassword) errors.confirmPassword = "Confirm Password is required"
    else if (data.confirmPassword !== data.password) errors.confirmPassword = "Passwords do not match"

    if (!data["company-name"].trim()) errors["company-name"] = "Company name is required"
    if (!data.address.trim()) errors.address = "Company address is required"

    // Only validate these if API is working
    if (!apiError) {
      if (!data.country) errors.country = "Country is required"
      if (!data.industry) errors.industry = "Industry is required"
    }

    if (!data.type) errors.type = "Please select a role"

    return errors
  }

  // Fallback country and industry options
  const fallbackCountries = [
    { country: "United States" },
    { country: "United Kingdom" },
    { country: "Canada" },
    { country: "Australia" },
    { country: "Germany" },
    { country: "France" },
    { country: "Japan" },
    { country: "China" },
    { country: "India" },
    { country: "Other" },
  ]

  const fallbackIndustries = [
    { industry: "Technology" },
    { industry: "Manufacturing" },
    { industry: "Healthcare" },
    { industry: "Finance" },
    { industry: "Retail" },
    { industry: "Education" },
    { industry: "Construction" },
    { industry: "Agriculture" },
    { industry: "Energy" },
    { industry: "Other" },
  ]

  // Use fallback options if API failed or returned empty arrays
  const countriesForSelect = countries.length > 0 ? countries : fallbackCountries
  const industriesForSelect = industries.length > 0 ? industries : fallbackIndustries

  return (
    <div className={`space-y-6 ${fonts.montserrat}`}>
      {apiError && (
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-md">
          <p className="text-yellow-700 text-sm">
            Warning: Some external data could not be loaded. Using fallback options instead.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">I am registering as a:</Label>
          <CustomRadio
            options={[
              { value: "buyer", label: "Buyer" },
              { value: "seller", label: "Seller" },
            ]}
            name="type"
            defaultValue=""
            value={formData.type}
            onChange={handleRoleChange}
          />
          {errors.type && <div className="text-red-500 text-sm">{errors.type}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-name" className="text-sm font-medium">
            Company name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="company-name"
            name="company"
            type="text"
            placeholder="Enter your company name"
            value={formData["company-name"]}
            onChange={(e) => handleInputChange("company-name", e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors["company-name"] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors["company-name"] && <div className="text-red-500 text-sm">{errors["company-name"]}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Company address<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="address"
            name="caddress"
            type="text"
            placeholder="Enter your company address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={`w-full px-3 py-2 border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium">
            Country<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select onValueChange={(value) => handleInputChange("country", value)} required={!apiError} name="country">
            <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countriesForSelect.map((country) => (
                <SelectItem key={country.country} value={country.country}>
                  {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <div className="text-red-500 text-sm">{errors.country}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium">
            Industry<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select onValueChange={(value) => handleInputChange("industry", value)} required={!apiError} name="industry">
            <SelectTrigger id="industry" className={errors.industry ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industriesForSelect.map((industry) => (
                <SelectItem key={industry.industry} value={industry.industry}>
                  {industry.industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && <div className="text-red-500 text-sm">{errors.industry}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md`}
          />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={`w-full px-3 py-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          />
          {errors.confirmPassword && <div className="text-red-500 text-sm">{errors.confirmPassword}</div>}
        </div>

        {errors.server && <div className="text-red-500 text-sm">{errors.server}</div>}
        {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}

        <Button
          type="submit"
          className="w-full mt-4 bg-[#37bfb1] hover:bg-[#2ea89b] text-white font-semibold py-2 px-4 rounded-md transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>

      {/* <SocialSignInButtons /> */}
    </div>
  )
}

