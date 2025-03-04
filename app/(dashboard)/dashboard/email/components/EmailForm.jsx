"use client"
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createEmailTemplate } from "@/app/actions/createEmailTemplate"
import { useRouter } from "next/navigation"

const positionOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]
const replaceAngleBrackets = (text) => {
  if (!text) return text
  return text.replace(/</g, '{').replace(/>/g, '}')
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64String = reader.result
      const base64WithoutPrefix = base64String.substring(base64String.indexOf(',') + 1)
      resolve(base64WithoutPrefix)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function EmailForm({emailId, initialData = null}) {
  const [formData, setFormData] = useState(() => {
      if (initialData) {
        return {
          title: initialData.title || "",
          subject: initialData.subject || "",
          description: initialData.description || "",
          headlogopos: initialData.headlogopos || "",
          headtext: initialData.headtext || "",
          footlogopos: initialData.footlogopos || "",
          foottext: initialData.foottext || "",
          status: initialData.status === "True" ? "active" : "inactive"
        };
      }
      return {};
    });
  const [footerPositionOptions, setFooterPositionOptions] = useState(positionOptions)
  const [submissionSuccess, setSubmissionSuccess] = useState(null)
  const [submissionError, setSubmissionError] = useState(null)
  const [existingHeadLogo, setExistingHeadLogo] = useState(null)
  const [existingFootLogo, setExistingFootLogo] = useState(null)
  const [headLogoChanged, setHeadLogoChanged] = useState(false)
  const [footLogoChanged, setFootLogoChanged] = useState(false)

  const router = useRouter();

  // Load initial data if available
  useEffect(() => {
    if (initialData) {
      if (initialData.headlogo) {
        setExistingHeadLogo(initialData.headlogo)
      }
      
      if (initialData.footlogo) {
        setExistingFootLogo(initialData.footlogo)
      }
    }
  }, [initialData])

  useEffect(() => {
    if (formData["headlogopos"]) {
      const headerPosition = formData["headlogopos"]
      let newOptions = positionOptions.filter((option) => option.value !== headerPosition)
      if (headerPosition === "center") {
        newOptions = newOptions.filter((option) => option.value !== "center")
      }
      setFooterPositionOptions(newOptions)
    } else {
      setFooterPositionOptions(positionOptions)
    }
  }, [formData["headlogopos"]])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = async (e) => {
    const { id, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      const fileType = file.type.toLowerCase()
      if (fileType === "image/jpeg" || fileType === "image/png") {
        // Convert the file to base64
        const base64 = await convertToBase64(file)
        setFormData((prev) => ({ ...prev, [id]: base64 }))
        
        // Mark logo as changed
        if (id === "headlogo") {
          setHeadLogoChanged(true)
        } else if (id === "footlogo") {
          setFootLogoChanged(true)
        }
      } else {
        alert("Please select a JPG or PNG file.")
        e.target.value = "" // Clear the file input
      }
    }
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "headlogopos") {
      setFormData((prev) => ({ ...prev, "footlogopos": "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formDataToSubmit = new FormData()

    // Append all form data with the API parameter names
    formDataToSubmit.append("title", formData.title || "")
    formDataToSubmit.append("subject", formData.subject || "")
    
    const processedDescription = replaceAngleBrackets(formData.description || "")
    formDataToSubmit.append("description", processedDescription)
    
    // Only include header logo if it's a new upload
    if (headLogoChanged && formData.headlogo) {
      formDataToSubmit.append("headlogo", formData.headlogo)
    }
    
    // Always include positions and text fields
    if (formData.headlogopos) {
      formDataToSubmit.append("headlogopos", formData.headlogopos)
    }
    
    if (formData.headtext) {
      formDataToSubmit.append("headtext", formData.headtext)
    }
    
    // Only include footer logo if it's a new upload
    if (footLogoChanged && formData.footlogo) {
      formDataToSubmit.append("footlogo", formData.footlogo)
    }
    
    if (formData.footlogopos) {
      formDataToSubmit.append("footlogopos", formData.footlogopos)
    }
    
    if (formData.foottext) {
      formDataToSubmit.append("foottext", formData.foottext)
    }
    
    // Default status to "active" if not provided
    formDataToSubmit.append("status", formData.status || "active")

    if(emailId === 'new') {
      formDataToSubmit.append("regid", '0')
      formDataToSubmit.append("mode", "New")
    } else {
      formDataToSubmit.append("regid", emailId)
      formDataToSubmit.append("mode", "Edit")
    }

    try {
      const result = await createEmailTemplate(formDataToSubmit)

      if (result.success) {
        setSubmissionSuccess(result.message)
        setSubmissionError(null)
        router.push("/dashboard/email")
      } else {
        setSubmissionError(result.message)
        setSubmissionSuccess(null)
      }
    } catch (error) {
      console.log(error.message)
      setSubmissionError("An error occurred while submitting the form.")
      setSubmissionSuccess(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {submissionSuccess && (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">{submissionSuccess}</div>
      )}
      {submissionError && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md">{submissionError}</div>
      )}
      
      <div className="grid gap-4">
        {/* Title Field */}
        <div className="grid gap-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            required={true}
            onChange={handleInputChange}
            value={formData.title || ""}
          />
        </div>

        {/* Subject Field */}
        <div className="grid gap-2">
          <Label htmlFor="subject">
            Subject <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject"
            type="text"
            required={true}
            onChange={handleInputChange}
            value={formData.subject || ""}
          />
        </div>

        {/* Description Field */}
        <div className="grid gap-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <RichTextEditor
            content={formData.description || ""}
            onChange={(content) => {
              setFormData((prev) => ({
                ...prev,
                description: content,
              }))
            }}
            defaultButtons={true}
            className="h-[200px]"
          />
        </div>

        {/* Header Logo Field */}
        <div className="grid gap-2">
          <Label htmlFor="headlogo">
            Header Logo
          </Label>
          {existingHeadLogo && !headLogoChanged && (
            <div className="mb-2 text-sm text-gray-600 flex items-center">
              <span className="mr-2">Current logo:</span>
              <span className="font-medium">{existingHeadLogo}</span>
            </div>
          )}
          <Input
            id="headlogo"
            type="file"
            required={false}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
          />
          {headLogoChanged && (
            <div className="mt-1 text-sm text-green-600">
              New logo will be uploaded on save
            </div>
          )}
        </div>

        {/* Header Logo Position Field */}
        <div className="grid gap-2">
          <Label htmlFor="headlogopos">
            Header Logo Position
          </Label>
          <Select 
            onValueChange={(value) => handleSelectChange("headlogopos", value)} 
            value={formData.headlogopos || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Header Text Field */}
        <div className="grid gap-2">
          <Label htmlFor="headtext">
            Header Text
          </Label>
          <Input
            id="headtext"
            type="text"
            required={false}
            onChange={handleInputChange}
            value={formData.headtext || ""}
          />
        </div>

        {/* Footer Logo Field */}
        <div className="grid gap-2">
          <Label htmlFor="footlogo">
            Footer Logo
          </Label>
          {existingFootLogo && !footLogoChanged && (
            <div className="mb-2 text-sm text-gray-600 flex items-center">
              <span className="mr-2">Current logo:</span>
              <span className="font-medium">{existingFootLogo}</span>
            </div>
          )}
          <Input
            id="footlogo"
            type="file"
            required={false}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
          />
          {footLogoChanged && (
            <div className="mt-1 text-sm text-green-600">
              New logo will be uploaded on save
            </div>
          )}
        </div>

        {/* Footer Logo Position Field */}
        <div className="grid gap-2">
          <Label htmlFor="footlogopos">
            Footer Logo Position
          </Label>
          <Select 
            onValueChange={(value) => handleSelectChange("footlogopos", value)} 
            value={formData.footlogopos || ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {footerPositionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Footer Text Field */}
        <div className="grid gap-2">
          <Label htmlFor="foottext">
            Footer Text
          </Label>
          <Input
            id="foottext"
            type="text"
            required={false}
            onChange={handleInputChange}
            value={formData.foottext || ""}
          />
        </div>
      </div>
      <Button className="w-fit" type="submit">
        Save Email Template
      </Button>
    </form>
  )
}