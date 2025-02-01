"use client"

import { useParams } from "next/navigation"
import { CampaignForm } from "../components/CampaignForm"

const CampaignDetailPage = () => {
  const params = useParams()
  const campaignId = params.campaignId
  const isNewCampaign = campaignId === "new"

  const handleSubmit = (formData) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // After submission, you might want to redirect the user or show a success message
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">{isNewCampaign ? "Add New Campaign" : "Edit Campaign"}</h1>
      <div>
        <CampaignForm
          initialData={
            isNewCampaign
              ? null
              : {
                  /* Fetch campaign data here */
                }
          }
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}

export default CampaignDetailPage

