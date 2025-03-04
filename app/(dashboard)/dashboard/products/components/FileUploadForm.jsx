"use client"

import { useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function FileUploadForm() {
  // Get productId from URL params
  const params = useParams()
  const productId = params.productId

  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadResults, setUploadResults] = useState([])

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to Array and append to existing files
      const newFiles = Array.from(e.target.files)
      setFiles(prevFiles => {
        // Limit to a maximum of 5 files
        const combinedFiles = [...prevFiles, ...newFiles]
        return combinedFiles.slice(0, 5)
      })
      setError(null)
      setSuccess(false)
    }
  }, [])

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    // Reset success and error when files change
    setSuccess(false)
    setError(null)
  }, [])

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data:image/jpeg;base64, part
          const base64String = reader.result.split(",")[1]
          resolve(base64String)
        } else {
          reject(new Error("Failed to convert file to base64"))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }, [])

  const uploadFile = useCallback(async (file, index) => {
    try {
      const base64 = await convertToBase64(file)
      
      // Validate base64 content
      if (!base64 || typeof base64 !== 'string') {
        throw new Error(`Invalid file content for ${file.name}`)
      }
      
      // Create FormData
      const formData = new FormData()
      formData.append("productid", productId || "")
      formData.append("file", base64)
      formData.append("filename", `Production certification ${index + 1}`)

      // Send to API
      const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/products/default2.aspx", {
        method: "POST",
        body: formData,
      })

      // Always parse the response to check for errors
      const text = await response.text()
      let data
      
      try {
        data = JSON.parse(text)
      } catch (e) {
        // If response isn't valid JSON, treat the text as the error message
        throw new Error(`Server returned invalid response: ${text}`)
      }
      
      // Check for API-specific error messages
      if (data.Response && data.Response.includes("Error:")) {
        throw new Error(data.Response)
      }
      
      if (!response.ok) {
        throw new Error(`Failed to upload file ${index + 1}: ${response.statusText}`)
      }
      
      return {
        success: true,
        file: file.name,
        message: data.Response || "File uploaded successfully"
      }
    } catch (error) {
      console.error(`Error uploading file ${index + 1}:`, error)
      return {
        success: false,
        file: file.name,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }
    }
  }, [convertToBase64, productId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (files.length !== 5) {
      setError("Please upload exactly 5 certification files")
      return
    }

    if (!productId) {
      setError("Product ID is missing. Please ensure you're on the correct page.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(false)
    setUploadResults([])

    try {
      const results = []
      // Upload each file one by one
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile(files[i], i)
        results.push(result)
        
        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100)
      }
      
      setUploadResults(results)
      
      // Check if all uploads were successful
      const allSuccessful = results.every(result => result.success)
      
      if (allSuccessful) {
        setSuccess(true)
      } else {
        // Construct error message from failed uploads
        const failedUploads = results.filter(result => !result.success)
        const errorMessage = failedUploads.map(result => 
          `${result.file}: ${result.message}`
        ).join('\n')
        
        setError(`Some files failed to upload:\n${errorMessage}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Production Certification Files</CardTitle>
        <CardDescription>Upload 5 production certification files. All files are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="files">Upload Files ({files.length}/5 selected)</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={isUploading || files.length >= 5}
                className="cursor-pointer"
              />
              {files.length >= 5 && (
                <p className="text-amber-600 text-sm mt-1">Maximum number of files reached (5)</p>
              )}
              {!productId && (
                <p className="text-red-600 text-sm mt-1">Warning: Product ID not found in URL</p>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="truncate max-w-[80%]">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">{Math.round(uploadProgress)}% Complete</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>All certification files have been uploaded successfully.</AlertDescription>
              </Alert>
            )}

            {uploadResults.length > 0 && !success && !isUploading && (
              <div className="space-y-2 text-sm border rounded-md p-3">
                <p className="font-medium">Upload Results:</p>
                <ul className="space-y-1">
                  {uploadResults.map((result, index) => (
                    <li key={index} className={`flex items-center ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? 
                        <CheckCircle2 className="h-3 w-3 mr-1" /> : 
                        <AlertCircle className="h-3 w-3 mr-1" />
                      }
                      {result.file}: {result.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isUploading || files.length !== 5 || !productId}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Certification Files"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}