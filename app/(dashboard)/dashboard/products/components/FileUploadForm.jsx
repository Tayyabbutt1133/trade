"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { fonts } from "@/components/ui/font";

export function FileUploadForm() {
  const params = useParams();
  const productId = params.productId;
  console.log("Product ID:", productId);

  // Store user webcode directly (no longer expecting an object with id)
  const [userData, setUserData] = useState(null);

  // Separate states for TDS and SDS files
  const [tdsFile, setTdsFile] = useState(null);
  const [sdsFile, setSdsFile] = useState(null);

  // UI states for TDS
  const [isUploadingTDS, setIsUploadingTDS] = useState(false);
  const [uploadProgressTDS, setUploadProgressTDS] = useState(0);
  const [errorTDS, setErrorTDS] = useState(null);
  const [successTDS, setSuccessTDS] = useState(false);
  const [uploadResultsTDS, setUploadResultsTDS] = useState([]);

  // UI states for SDS
  const [isUploadingSDS, setIsUploadingSDS] = useState(false);
  const [uploadProgressSDS, setUploadProgressSDS] = useState(0);
  const [errorSDS, setErrorSDS] = useState(null);
  const [successSDS, setSuccessSDS] = useState(false);
  const [uploadResultsSDS, setUploadResultsSDS] = useState([]);

  // For Product Certification – 5 separate file slots.
  const initialProductCertState = Array.from({ length: 5 }, () => ({
    file: null,
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
    result: null,
  }));
  const [productCertUploads, setProductCertUploads] = useState(
    initialProductCertState
  );

  // ─────────────────────────────────────────────────────────────
  // 1. Fetch User Data
  // ─────────────────────────────────────────────────────────────
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      const webcode = data?.userData?.webcode;
      // console.log("User webcode :", webcode)
      if (webcode) {
        setUserData(webcode);
        console.log("Fetched user webcode:", webcode);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. Handle File Changes for TDS, SDS, & Product Certification
  // ─────────────────────────────────────────────────────────────
  const handleTdsFileChange = useCallback((e) => {
    if (e.target.files?.length) {
      setTdsFile(e.target.files[0]);
      setErrorTDS(null);
      setSuccessTDS(false);
    }
  }, []);

  const handleSdsFileChange = useCallback((e) => {
    if (e.target.files?.length) {
      setSdsFile(e.target.files[0]);
      setErrorSDS(null);
      setSuccessSDS(false);
    }
  }, []);

  const removeTdsFile = useCallback(() => {
    setTdsFile(null);
    setSuccessTDS(false);
    setErrorTDS(null);
  }, []);

  const removeSdsFile = useCallback(() => {
    setSdsFile(null);
    setSuccessSDS(false);
    setErrorSDS(null);
  }, []);

  const handleProductCertFileChange = useCallback((index, e) => {
    if (e.target.files?.length) {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          file: e.target.files[0],
          error: null,
          success: false,
        };
        return updated;
      });
    }
  }, []);

  const removeProductCertFile = useCallback((index) => {
    setProductCertUploads((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        file: null,
        error: null,
        success: false,
      };
      return updated;
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 3. Convert File to Base64 (common)
  // ─────────────────────────────────────────────────────────────
  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 4. Common Upload Function (for any file)
  // ─────────────────────────────────────────────────────────────
  const uploadFile = useCallback(
    async (file, filenameLabel) => {
      try {
        // Validate file size (3MB limit)
        if (file.size > 3 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the 3MB limit`);
        }

        // Convert file to base64
        const base64 = await convertToBase64(file);
        if (!base64 || typeof base64 !== "string") {
          throw new Error(`Invalid file content for ${file.name}`);
        }

        // Determine file extension and filetype
        const extension = file.name.split(".").pop().toLowerCase();
        let filetype = "Other";
        if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(extension)) {
          filetype = "Image";
        } else if (extension === "pdf") {
          filetype = "Pdf";
        } else if (["doc", "docx"].includes(extension)) {
          filetype = "Doc";
        }
        console.log("Detected filetype:", filetype);

        // Enforce restrictions:
        // For TDS and SDS, only allow Pdf or Doc formats.
        if (
          (filenameLabel === "TDS" || filenameLabel === "SDS") &&
          !["pdf", "doc", "docx"].includes(extension)
        ) {
          throw new Error(
            `${filenameLabel} file must be in PDF, DOC, or DOCX format.`
          );
        }
        // For Product Certification, only allow images.
        if (
          filenameLabel.startsWith("Product Certification") &&
          filetype !== "Image"
        ) {
          throw new Error(
            "Product Certification files must be in image format (png, jpg, jpeg, gif, bmp, webp)."
          );
        }

        // adding logby because api is expecting, but we don't have anything dynamic in it
        const logby = 0;

        const formData = new FormData();
        formData.append("productid", productId || "");
        formData.append("file", base64);
        formData.append("filename", filenameLabel);
        formData.append("ext", extension);
        formData.append("webcode", userData);
        formData.append("filetype", filetype);
        formData.append("logby", logby);

        // Log FormData entries
        console.log("FormData payload:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/requests/products/default2.aspx",
          { method: "POST", body: formData }
        );

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Server returned invalid response: ${text}`);
        }

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
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    },
    [convertToBase64, productId, userData]
  );

  // ─────────────────────────────────────────────────────────────
  // 5. Handle TDS Submit
  // ─────────────────────────────────────────────────────────────
  const handleTdsSubmit = async (e) => {
    e.preventDefault();
    if (!tdsFile) {
      setErrorTDS("Please upload the TDS (Technical Data Sheet) file");
      return;
    }
    if (!productId) {
      setErrorTDS(
        "Product ID is missing. Please ensure you're on the correct page."
      );
      return;
    }
    if (!userData) {
      setErrorTDS("Webcode not found. Please ensure you're logged in.");
      return;
    }
    setIsUploadingTDS(true);
    setUploadProgressTDS(0);
    setErrorTDS(null);
    setSuccessTDS(false);
    setUploadResultsTDS([]);
    try {
      const result = await uploadFile(tdsFile, "TDS");
      setUploadProgressTDS(100);
      setUploadResultsTDS([result]);
      if (result.success) {
        setSuccessTDS(true);
      } else {
        setErrorTDS(`File failed to upload: ${result.message}`);
      }
    } catch (err) {
      setErrorTDS(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsUploadingTDS(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 6. Handle SDS Submit
  // ─────────────────────────────────────────────────────────────
  const handleSdsSubmit = async (e) => {
    e.preventDefault();
    if (!sdsFile) {
      setErrorSDS("Please upload the SDS (Safety Data Sheet) file");
      return;
    }
    if (!productId) {
      setErrorSDS(
        "Product ID is missing. Please ensure you're on the correct page."
      );
      return;
    }
    if (!userData) {
      setErrorSDS("Webcode not found. Please ensure you're logged in.");
      return;
    }
    setIsUploadingSDS(true);
    setUploadProgressSDS(0);
    setErrorSDS(null);
    setSuccessSDS(false);
    setUploadResultsSDS([]);
    try {
      const result = await uploadFile(sdsFile, "SDS");
      setUploadProgressSDS(100);
      setUploadResultsSDS([result]);
      if (result.success) {
        setSuccessSDS(true);
      } else {
        setErrorSDS(`File failed to upload: ${result.message}`);
      }
    } catch (err) {
      setErrorSDS(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsUploadingSDS(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7. Handle Product Certification Upload (for each slot)
  // ─────────────────────────────────────────────────────────────
  const handleProductCertUpload = async (index, e) => {
    e.preventDefault();
    const cert = productCertUploads[index];
    if (!cert.file) {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].error = `Please upload Product Certification ${
          index + 1
        } file.`;
        return updated;
      });
      return;
    }
    if (!productId) {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].error = "Product ID is missing.";
        return updated;
      });
      return;
    }
    if (!userData) {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].error =
          "Webcode not found. Please ensure you're logged in.";
        return updated;
      });
      return;
    }
    // Mark upload in progress for this certification slot
    setProductCertUploads((prev) => {
      const updated = [...prev];
      updated[index].isUploading = true;
      updated[index].progress = 0;
      updated[index].error = null;
      updated[index].success = false;
      return updated;
    });
    try {
      const result = await uploadFile(
        cert.file,
        `Product Certification ${index + 1}`
      );
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].progress = 100;
        updated[index].result = result;
        updated[index].success = result.success;
        if (!result.success) {
          updated[index].error = `Upload failed: ${result.message}`;
        }
        return updated;
      });
    } catch (err) {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].error =
          err instanceof Error ? err.message : "An unknown error occurred";
        return updated;
      });
    } finally {
      setProductCertUploads((prev) => {
        const updated = [...prev];
        updated[index].isUploading = false;
        return updated;
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 8. Render the Form
  // ─────────────────────────────────────────────────────────────
  return (
    <Card className={`w-full ${fonts.montserrat}`}>
      <CardHeader>
        <CardTitle>Upload Certification Files</CardTitle>
        <CardDescription>
          Upload your TDS, SDS, and Product Certification files individually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-10">
          {/* TDS Section */}
          <div className="space-y-4">
            <Label className="font-bold">TDS (Technical Data Sheet)</Label>
            <Input
              type="file"
              onChange={handleTdsFileChange}
              accept=".pdf,.doc,.docx"
              disabled={isUploadingTDS || tdsFile !== null}
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
                  disabled={isUploadingTDS}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isUploadingTDS && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgressTDS} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {Math.round(uploadProgressTDS)}% Complete
                </p>
              </div>
            )}
            {errorTDS && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="whitespace-pre-line">
                  {errorTDS}
                </AlertDescription>
              </Alert>
            )}
            {successTDS && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  TDS file uploaded successfully.
                </AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleTdsSubmit}
              className="w-full mt-2"
              disabled={isUploadingTDS || !tdsFile || !productId}
            >
              {isUploadingTDS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading TDS...
                </>
              ) : (
                "Upload TDS File"
              )}
            </Button>
          </div>

          {/* SDS Section */}
          <div className="space-y-4">
            <Label className="font-bold">SDS (Safety Data Sheet)</Label>
            <Input
              type="file"
              onChange={handleSdsFileChange}
              accept=".pdf,.doc,.docx"
              disabled={isUploadingSDS || sdsFile !== null}
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
                  disabled={isUploadingSDS}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isUploadingSDS && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgressSDS} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {Math.round(uploadProgressSDS)}% Complete
                </p>
              </div>
            )}
            {errorSDS && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="whitespace-pre-line">
                  {errorSDS}
                </AlertDescription>
              </Alert>
            )}
            {successSDS && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  SDS file uploaded successfully.
                </AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleSdsSubmit}
              className="w-full mt-2"
              disabled={isUploadingSDS || !sdsFile || !productId}
            >
              {isUploadingSDS ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading SDS...
                </>
              ) : (
                "Upload SDS File"
              )}
            </Button>
          </div>

          {/* Product Certification Section */}
          <div className="space-y-6">
            <Label className="font-bold">
              Product Certification (5 files required - images only)
            </Label>
            {productCertUploads.map((cert, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <Label>Product Certification {index + 1}</Label>
                <Input
                  type="file"
                  onChange={(e) => handleProductCertFileChange(index, e)}
                  accept=".png,.jpg,.jpeg,.gif,.bmp,.webp"
                  disabled={cert.isUploading || cert.file !== null}
                  className="cursor-pointer"
                />
                {cert.file && (
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <span className="truncate max-w-[80%]">
                      {cert.file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProductCertFile(index)}
                      disabled={cert.isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {cert.isUploading && (
                  <div className="space-y-2">
                    <Label>Upload Progress</Label>
                    <Progress value={cert.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {Math.round(cert.progress)}% Complete
                    </p>
                  </div>
                )}
                {cert.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="whitespace-pre-line">
                      {cert.error}
                    </AlertDescription>
                  </Alert>
                )}
                {cert.success && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Product Certification {index + 1} uploaded successfully.
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={(e) => handleProductCertUpload(index, e)}
                  className="w-full mt-2"
                  disabled={cert.isUploading || !cert.file || !productId}
                >
                  {cert.isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading Product Certification {index + 1}...
                    </>
                  ) : (
                    `Upload Product Certification ${index + 1}`
                  )}
                </Button>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
