"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fonts } from "@/components/ui/font";
import { CustomRadio } from "./CustomRadio";
import { useRouter } from "next/navigation";
import { SocialSignInButtons } from "./SocialSignInButtons";
import { Register } from "@/app/actions/signup";
import roleAccessStore from "@/store/role-access-permission";

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer", // role is part of formData
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState();
  const router = useRouter();

  const setRole = roleAccessStore((state)=>state.setRole)


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  // Update the role in formData when the radio selection changes
  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    // Create FormData from the form element
    const formDataTosubmit = new FormData(e.target);
    console.log("Form data :", formDataTosubmit);
    
    // Remove the confirmPassword field so it won't be sent to the API
    formDataTosubmit.delete("confirmPassword");
  
    // Send the modified FormData to your API
    const result = await Register(formDataTosubmit);
    console.log("Server response :", result);
  
    if (result.success) {
      setSuccess("Registration successful");
  
      // Use the type from the frontend form (formData.role) instead of the API response.
      setRole({
        id: result.id, // Assuming your API returns an id; adjust as needed.
        type: formData.role.toLowerCase(), // Convert to lowercase for consistency.
      });
  
      // Redirect the user to a dynamic dashboard URL based on their selected type.
      router.push(`/dashboard/${formData.role.toLowerCase()}/new`);
    } else {
      setErrors({ server: "Error Occurred" });
    }
  };
  

  const formFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
    { id: "confirmPassword", label: "Confirm Password", type: "password" },
  ];

  const validateForm = (data) => {
    const errors = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!data.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(data.password)) {
      errors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  return (
    <div className={`space-y-6 ${fonts.montserrat}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">
            I am registering as a:
          </Label>
          <CustomRadio
            options={[
              { value: "Buyer", label: "Buyer" },
              { value: "Seller", label: "Seller" },
            ]}
            name="type"
            defaultValue="buyer"
            value={formData.role} // Pass the current role value
            onChange={handleRoleChange}
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
              className={`w-full px-3 py-2 border ${
                errors[field.id] ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#37bfb1]`}
            />
            {errors[field.id] && (
              <div className="text-red-500 text-sm">{errors[field.id]}</div>
            )}
          </div>
        ))}

        {errors.server && (
          <div className="text-red-500 text-sm">{errors.server}</div>
        )}

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
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <SocialSignInButtons />
    </div>
  );
}
