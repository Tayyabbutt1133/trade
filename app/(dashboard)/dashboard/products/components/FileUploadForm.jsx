"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { fonts } from "@/components/ui/font";

export function FileUploadForm() {
  // Get productId from URL params
  const params = useParams();
  const productId = params.productId;
  console.log("Product ID:", productId);

  // States for each file section
  const [sdsFile, setSdsFile] = useState(null);            // 1 file
  const [tdsFile, setTdsFile] = useState(null);            // 1 file
  const [productionFiles, setProductionFiles] = useState([]); // up to 5 files

  // Upload progress & status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);

  // -- Handle File Changes --------------------------------------------------

  // SDS (Safety Data Sheet) - single file
  const handleSdsFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSdsFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  }, []);

  // TDS (Technical Data Sheet) - single file
  const handleTdsFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTdsFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  }, []);

  // Production certifications - up to 5 files
  const handleProductionFileChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setProductionFiles((prev) => {
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 5); // limit to 5
      });
      setError(null);
      setSuccess(false);
    }
  }, []);

  // Remove selected file(s)
  const removeSdsFile = useCallback(() => {
    setSdsFile(null);
    setSuccess(false);
    setError(null);
  }, []);

  const removeTdsFile = useCallback(() => {
    setTdsFile(null);
    setSuccess(false);
    setError(null);
  }, []);

  const removeProductionFile = useCallback((index) => {
    setProductionFiles((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
    setError(null);
  }, []);

  // -- Convert File to Base64 ----------------------------------------------

  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the 'data:...' prefix if needed
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // -- Upload a Single File -----------------------------------------------

  const uploadFile = useCallback(
    async (file, filenameLabel) => {
      try {
        // Validate file size (3MB limit)
        if (file.size > 3 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the 3MB limit`);
        }

        const base64 = await convertToBase64(file);
        if (!base64 || typeof base64 !== "string") {
          throw new Error(`Invalid file content for ${file.name}`);
        }

        // Build FormData
        const formData = new FormData();
        formData.append("productid", productId || "");
        formData.append("file", base64);
        formData.append("filename", filenameLabel);

        // POST to your API
        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/requests/products/default2.aspx",
          {
            method: "POST",
            body: formData,
          }
        );

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned invalid response: ${text}`);
        }

        // Check for server-side error
        if (data.Response && data.Response.includes("Error:")) {
          throw new Error(data.Response);
        }

        if (!response.ok) {
          throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        return {
          success: true,
          file: file.name,
          message: data.Response || "File uploaded successfully",
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        return {
          success: false,
          file: file.name,
          message: error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
    [convertToBase64, productId]
  );

  // -- Handle Form Submission ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate presence of SDS, TDS, and exactly 5 production files
    if (!sdsFile) {
      setError("Please upload the SDS (Safety Data Sheet) file");
      return;
    }
    if (!tdsFile) {
      setError("Please upload the TDS (Technical Data Sheet) file");
      return;
    }
    if (productionFiles.length !== 5) {
      setError("Please upload exactly 5 production certification files");
      return;
    }
    if (!productId) {
      setError("Product ID is missing. Please ensure you're on the correct page.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(false);
    setUploadResults([]);

    try {
      const results = [];
      const totalFiles = 1 + 1 + productionFiles.length; // 1 SDS + 1 TDS + 5 production

      // 1) Upload SDS first
      const sdsResult = await uploadFile(sdsFile, "SDS (Safety Data Sheet)");
      results.push(sdsResult);
      setUploadProgress((1 / totalFiles) * 100);

      // 2) Upload TDS second
      const tdsResult = await uploadFile(tdsFile, "TDS (Technical Data Sheet)");
      results.push(tdsResult);
      setUploadProgress((2 / totalFiles) * 100);

      // 3) Upload production files last
      for (let i = 0; i < productionFiles.length; i++) {
        const label = `Production certification ${i + 1}`;
        const result = await uploadFile(productionFiles[i], label);
        results.push(result);
        setUploadProgress(((2 + (i + 1)) / totalFiles) * 100);
      }

      setUploadResults(results);

      // Check if all were successful
      const allSuccessful = results.every((r) => r.success);
      if (allSuccessful) {
        setSuccess(true);
      } else {
        const failed = results.filter((r) => !r.success);
        const errMsg = failed.map((r) => `${r.file}: ${r.message}`).join("\n");
        setError(`Some files failed to upload:\n${errMsg}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className={`w-full ${fonts.montserrat}`}>
      <CardHeader>
        <CardTitle>Upload Certification Files</CardTitle>
        <CardDescription>Please upload the required files.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SDS Section */}
          <div className="space-y-2">
            <Label className="font-bold">SDS (Safety Data Sheet)</Label>
            <Input
              type="file"
              onChange={handleSdsFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isUploading || sdsFile !== null}
              className="cursor-pointer"
            />
            {sdsFile && (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="truncate max-w-[80%]">{sdsFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeSdsFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* TDS Section */}
          <div className="space-y-2">
            <Label className="font-bold">TDS (Technical Data Sheet)</Label>
            <Input
              type="file"
              onChange={handleTdsFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isUploading || tdsFile !== null}
              className="cursor-pointer"
            />
            {tdsFile && (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span className="truncate max-w-[80%]">{tdsFile.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeTdsFile}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Production Certifications Section */}
          <div className="space-y-2">
            <Label className="font-bold">Production Certifications (5 files)</Label>
            <Input
              type="file"
              multiple
              onChange={handleProductionFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={isUploading || productionFiles.length >= 5}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Upload exactly 5 production certification files.
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {productionFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="truncate max-w-[80%]">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProductionFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(uploadProgress)}% Complete
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                All certification files have been uploaded successfully.
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && !success && !isUploading && (
            <div className="space-y-2 text-sm border rounded-md p-3">
              <p className="font-medium">Upload Results:</p>
              <ul className="space-y-1">
                {uploadResults.map((result, index) => (
                  <li
                    key={index}
                    className={`flex items-center ${
                      result.success ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {result.file}: {result.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-6"
            disabled={
              isUploading ||
              !sdsFile ||
              !tdsFile ||
              productionFiles.length !== 5 ||
              !productId
            }
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
  );
}
