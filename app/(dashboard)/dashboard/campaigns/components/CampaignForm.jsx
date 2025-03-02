"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCampaign } from "@/app/actions/createCampaign"

export function CampaignForm({ initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      campname: "",
      camptype: "",
      emailtemp: "",
      audience: "",
      descri: "",
      rdate: "",
      logby: "", 
    }
  )
  
  const [emailTemplates, setEmailTemplates] = useState([])
  const [audiences, setAudiences] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch email templates
    const fetchEmailTemplates = async () => {
      try {
        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/emailtemplate/")
        const data = await response.json()
        if (data.EmailTemplate) {
          setEmailTemplates(data.EmailTemplate)
        }
      } catch (error) {
        console.error("Error fetching email templates:", error)
      }
    }

    // Fetch audiences
    const fetchAudiences = async () => {
      try {
        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/audience/")
        const data = await response.json()
        if (data.Audience) {
          setAudiences(data.Audience)
        }
      } catch (error) {
        console.error("Error fetching audiences:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmailTemplates()
    fetchAudiences()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('campname', formData.campname)
    formDataToSubmit.append('camptype', formData.camptype)
    formDataToSubmit.append('emailtemp', formData.emailtemp)
    formDataToSubmit.append('audience', formData.audience)
    formDataToSubmit.append('descri', formData.descri)
    formDataToSubmit.append('rdate', formData.rdate)
    formDataToSubmit.append('logby', '0')

    try{
      const data = (await createCampaign(formDataToSubmit)).data
      console.log(data)
    }catch(e){
      console.error("Error submitting form:", e)
    }
  }

  if (isLoading) {
    return <div>Loading form data...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="campname">Campaign Name</Label>
        <Input id="campname" name="campname" value={formData.campname} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="camptype">Campaign Type</Label>
        <Select value={formData.camptype} onValueChange={(value) => handleSelectChange("camptype", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select campaign type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Discount">Discount</SelectItem>
            <SelectItem value="Promotion">Promotion</SelectItem>
            <SelectItem value="Seasonal">Seasonal</SelectItem>
            <SelectItem value="Flash Sale">Flash Sale</SelectItem>
            <SelectItem value="Holiday">Holiday</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="emailtemp">Email Template</Label>
        <Select
          value={formData.emailtemp}
          onValueChange={(value) => handleSelectChange("emailtemp", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select email template" />
          </SelectTrigger>
          <SelectContent>
            {emailTemplates.map((template) => (
              <SelectItem key={template.id} value={template.title}>
                {template.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="audience">Audience</Label>
        <Select
          value={formData.audience}
          onValueChange={(value) => handleSelectChange("audience", value)}
          required
        >
          <SelectTrigger id="audience">
            <SelectValue placeholder="Select Audience" />
          </SelectTrigger>
          <SelectContent>
            {audiences.map((audience) => (
              <SelectItem key={audience.id} value={audience.title}>
                {audience.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="descri">Description</Label>
        <Textarea
          id="descri"
          name="descri"
          value={formData.descri}
          onChange={handleInputChange}
          placeholder="Enter campaign details..."
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rdate">Relay Date</Label>
        <Input
          id="rdate"
          name="rdate"
          type="date"
          value={formData.rdate}
          onChange={handleInputChange}
          required
        />
      </div>

      <Button type="submit" className="mt-4 w-fit">
        {initialData ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  )
}