"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useParams } from "next/navigation"

export default function PropertyTable({initialData}) {
  const {productId} = useParams()
  const [rows, setRows] = useState(() => { 
    if (initialData && initialData.length > 0) {
      return initialData.map(data => ({
        id: data.id,
        property: data.property || "",
        value: data.value || "",
        description: data.description || ""
      }));
    }
    return [{ id: 1, property: "", value: "", description: "" }];
  });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // null, "success", "error"
  const [statusMessage, setStatusMessage] = useState("")

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map((row) => row.id)) + 1 : 1
    setRows([...rows, { id: newId, property: "", value: "", description: "" }])
  }

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const updateRow = (id, field, value) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    setStatusMessage("")
    
    try {
      // Validate data before submission
      const invalidRows = rows.filter(row => !row.property || !row.value)
      if (invalidRows.length > 0) {
        throw new Error("All properties must have a name and value")
      }
      
      // Submit each row individually
      const results = await Promise.all(
        rows.map(async (row) => {
          const formData = new FormData()
          formData.append("property", row.property)
          formData.append("value", row.value)
          formData.append("description", row.description || "")
          formData.append("productid", productId)
          
          const response = await fetch(
            "https://tradetoppers.esoftideas.com/esi-api/requests/products/default3.aspx", 
            {
              method: "POST",
              body: formData,
            }
          )
          
          const data = await response.json()
          
          if (!response.ok || (data.Response && data.Response.includes("Error"))) {
            return {
              success: false,
              message: data.Response || `Failed to save ${row.property}`
            }
          }
          
          return {
            success: true,
            message: data.Response || `${row.property} saved successfully`
          }
        })
      )
      
      // Check if all submissions were successful
      const failures = results.filter(result => !result.success)
      
      if (failures.length === 0) {
        setSubmitStatus("success")
        setStatusMessage("All properties saved successfully")
      } else {
        setSubmitStatus("error")
        setStatusMessage(`Failed to save ${failures.length} of ${rows.length} properties`)
      }
      
    } catch (error) {
      setSubmitStatus("error")
      setStatusMessage(error.message || "An error occurred while saving properties")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Properties Table</CardTitle>
        <Button onClick={addRow} size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Row
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 font-medium text-sm border-b pb-2">
            <div className="col-span-3">Property</div>
            <div className="col-span-3">Value</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3">
                <Input 
                  placeholder="Property name" 
                  value={row.property} 
                  onChange={(e) => updateRow(row.id, "property", e.target.value)} 
                />
              </div>
              <div className="col-span-3">
                <Input 
                  placeholder="Value" 
                  value={row.value} 
                  onChange={(e) => updateRow(row.id, "value", e.target.value)} 
                />
              </div>
              <div className="col-span-5">
                <Textarea 
                  placeholder="Short description" 
                  className="min-h-[60px] resize-none" 
                  value={row.description} 
                  onChange={(e) => updateRow(row.id, "description", e.target.value)} 
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeRow(row.id)} 
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10" 
                  disabled={rows.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Status alert */}
          {submitStatus === "success" && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 mt-6">
            <Button onClick={addRow} variant="outline" className="flex-1">
              <Plus className="h-4 w-4 mr-2" /> Add Another Row
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              variant="default" 
              className="flex-1"
              disabled={isSubmitting || rows.some(row => !row.property || !row.value)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save All Properties
                </>
              )}
            </Button>
          </div>

          {/* Display the current data for demonstration */}
          {/* <div className="mt-8 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Current Data:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(rows, null, 2)}</pre>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}