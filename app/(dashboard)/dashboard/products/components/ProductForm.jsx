"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { CategoryComboBoxWithDialog } from "./CategoryComboBoxWithDialog";
import { createProduct } from "@/app/actions/createProduct";
import { redirect, replace } from "next/navigation";

export function ProductForm({
  initialBrandOptions = [],
  initialCategoriesOption = [],
  initialData = null,
  productId,
}) {
  const isEditMode = productId && productId !== "new";

  const [formData, setFormData] = useState({
    product: "",
    description: "",
    code: "",
    formula: "",
    brand: "",
    category: "",
    maincategory: "",
    subcategory: "",
    chemical: "",
    cas: "",
    cinum: "",
    images: [],
    // functions: []
  });

  const [isLoading, setIsLoading] = useState(!initialData && isEditMode);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Option states
  const [brandOptions, setBrandOptions] = useState(initialBrandOptions);
  const [categoriesOption, setCategoriesOption] = useState(
    initialCategoriesOption
  );
  const [mainCategoriesOption, setMainCategoriesOption] = useState([]);
  const [subcategoriesOption, setSubcategoriesOption] = useState([]);

  // Selected category IDs for dependency chain
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(null);

  // User Data state
  const [userData, setUserData] = useState({});

  // Load initial data when available
  // Load initial data when available
  useEffect(() => {
    if (initialData) {
      setFormData({
        product: initialData.product || "",
        description: initialData.description || "",
        code: initialData.code || "",
        formula: initialData.formula || "",
        brand: initialData.brand || "",
        category: initialData.category || "",
        maincategory: initialData.maincategory || "",
        subcategory: initialData.subcategory || "",
        chemical: initialData.chemical || "",
        cas: initialData.cas || "",
        cinum: initialData.cinum || "",
        images: initialData.images || [],
        // functions: initialData.functions || []
      });

      // If there's a category in the initialData, fetch related main categories
      if (initialData.category) {
        const categoryObj = categoriesOption.find(
          (cat) => cat.category === initialData.category
        );
        if (categoryObj && categoryObj.id) {
          setSelectedCategoryId(categoryObj.id);
          fetchMainCategories(categoryObj.id);
          // Removed the nested main category and subcategory logic from here
        }
      }

      setIsLoading(false);
    }
  }, [initialData, categoriesOption]);

  // Handle main category selection when main categories are loaded
  useEffect(() => {
    if (
      initialData &&
      initialData.maincategory &&
      mainCategoriesOption.length > 0
    ) {
      const mainCategoryObj = mainCategoriesOption.find(
        (mainCat) => mainCat.maincategory === initialData.maincategory
      );

      if (mainCategoryObj && mainCategoryObj.id) {
        setSelectedMainCategoryId(mainCategoryObj.id);
        fetchSubcategories(mainCategoryObj.id);
      }
    }
  }, [mainCategoriesOption, initialData]);

  // Handle subcategory selection when subcategories are loaded
  useEffect(() => {
    if (
      initialData &&
      initialData.subcategory &&
      subcategoriesOption.length > 0 &&
      !isLoading
    ) {
      // No need to set anything here, just having the correct value in formData is enough
      // This useEffect ensures we don't have timing issues with the dependent dropdowns
    
    }
  }, [subcategoriesOption, initialData, isLoading]);

  // Load options on initial component mount
  useEffect(() => {
    fetchOptionForType("brand");
    fetchOptionForType("category");
  }, []);

  // getting userdata from cookies to authenticate user type on server side
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/auth/user");
      const data = (await response.json()).userData;
      setUserData(data);
    };
    fetchUserData();
  }, []);

  // Fetch options function
  const fetchOptionForType = async (type) => {
    let endpoint = "";
    let setOption;
    if (type === "brand") {
      endpoint = "https://tradetoppers.esoftideas.com/esi-api/responses/brand/";
      setOption = setBrandOptions;
    } else if (type === "category") {
      endpoint =
        "https://tradetoppers.esoftideas.com/esi-api/responses/categories/";
      setOption = setCategoriesOption;
    }

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (type === "brand") {
        setOption(data.Brand || data);
      } else if (type === "category") {
        setOption(data.Categories || data);
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error);
    }
  };

  // Function to fetch main categories based on category ID
  const fetchMainCategories = async (categoryId) => {
    if (!categoryId) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("catid", categoryId);

    try {
      const endpoint =
        "https://tradetoppers.esoftideas.com/esi-api/responses/maincategory/";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formDataToSubmit,
      });
      const data = await res.json();
      setMainCategoriesOption(data.MainCategories || []);
    } catch (error) {
      console.error("Error fetching main categories:", error);
      setMainCategoriesOption([]);
    }
  };

  // Function to fetch subcategories based on main category ID
  const fetchSubcategories = async (mainCategoryId) => {
    if (!mainCategoryId) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("catid", mainCategoryId); // API expects 'catid' but it's actually the main category ID

    try {
      const endpoint =
        "https://tradetoppers.esoftideas.com/esi-api/responses/subcategories/";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formDataToSubmit,
      });
      const data = await res.json();
      setSubcategoriesOption(data.SubCategories || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategoriesOption([]);
    }
  };

  // Handle input changes
  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear any errors for this field
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // Handle options changes
  const handleBrandChange = async (newValue) => {
    handleInputChange("brand", newValue.brand);
  };

  const handleCategoryChange = async (newValue) => {
    // Update category
    handleInputChange("category", newValue.category);

    // Clear dependent fields
    handleInputChange("maincategory", "");
    handleInputChange("subcategory", "");
    setMainCategoriesOption([]);
    setSubcategoriesOption([]);

    // Set the selected category ID and fetch main categories
    if (newValue && newValue.id) {
      setSelectedCategoryId(newValue.category);
      await fetchMainCategories(newValue.id);
    } else {
      setSelectedCategoryId(null);
    }

    // Reset main category ID since we cleared the main category
    setSelectedMainCategoryId(null);
  };

  const handleMainCategoryChange = async (newValue) => {
    // Update main category
    handleInputChange("maincategory", newValue.maincategory);

    // Clear subcategory
    handleInputChange("subcategory", "");
    setSubcategoriesOption([]);

    // Set the selected main category ID and fetch subcategories
    if (newValue && newValue.id) {
      setSelectedMainCategoryId(newValue.maincategory);
      await fetchSubcategories(newValue.id);
    } else {
      setSelectedMainCategoryId(null);
    }
  };

  const handleSubcategoryChange = async (newValue) => {
    handleInputChange("subcategory", newValue.subcategory);
  };
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSubmit = new FormData();
    const imageDataToSubmit = new FormData();

    // Append all product data
    formDataToSubmit.append("product", formData.product || "");
    formDataToSubmit.append("description", formData.description || "");
    formDataToSubmit.append("code", formData.code || "");
    formDataToSubmit.append("formula", formData.formula || "");
    formDataToSubmit.append("brand", formData.brand || "");
    formDataToSubmit.append("category", formData.category || "");
    formDataToSubmit.append("maincategory", formData.maincategory || "");
    formDataToSubmit.append("subcategory", formData.subcategory || "");
    formDataToSubmit.append("chemical", formData.chemical || "");
    formDataToSubmit.append("cas", formData.cas || "");
    formDataToSubmit.append("cinum", formData.cinum || "");

    if (userData.type !== "Seller" && userData.type !== "buyer") {
      formDataToSubmit.append("logby", "0");
    } else if (
      userData.type?.toLowerCase() === "seller" ||
      userData.type?.toLowerCase() === "buyer"
    ) {
      formDataToSubmit.append("logby", userData.id);
    }

    // Append mode based on whether this is a new product or an edit
    if (isEditMode) {
      formDataToSubmit.append("Mode", "Edit");
      formDataToSubmit.append("regid", productId);
    } else {
      formDataToSubmit.append("Mode", "New");
      formDataToSubmit.append("regid", "0"); // Set default regid as 0
    }

    // Handle functions array if needed
    if (formData.functions && formData.functions.length > 0) {
      formDataToSubmit.append("functions", JSON.stringify(formData.functions));
    }

    // Add images array as JSON string
    if (formData.images && formData.images.length > 0) {
      // Only send the necessary image data
      const imageData = formData.images.map((img) => ({
        base64: img.base64,
        name: img.name,
        type: img.type,
      }));
      imageDataToSubmit.append("images", JSON.stringify(imageData));
    }

    try {
      const result = await createProduct(formDataToSubmit, imageDataToSubmit);
      if (result.success) {
        setSubmissionSuccess(result.message);
        setSubmissionError(null);

        // Clean up session storage if needed
        if (isEditMode) {
          sessionStorage.removeItem(`product_${productId}`);
        }

        // Wait a moment before redirecting so user can see success message
        setTimeout(() => {
          redirect(`/dashboard/products/${result.data.id}`);
        }, 1000);
      } else {
        setSubmissionError(result.message);
        setSubmissionSuccess(null);
      }
    } catch (error) {
      setSubmissionError("An error occurred while saving the product");
      setSubmissionSuccess(null);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading product data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product">Name</Label>
          <Input
            id="product"
            name="product"
            type="text"
            value={formData.product || ""}
            onChange={(e) => handleInputChange("product", e.target.value)}
            required
          />
          {errors.product && (
            <p className="text-red-500 text-sm">{errors.product}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Other form fields */}
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            name="code"
            type="text"
            value={formData.code || ""}
            onChange={(e) => handleInputChange("code", e.target.value)}
            required
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="formula">Formula</Label>
          <Input
            id="formula"
            name="formula"
            type="text"
            value={formData.formula || ""}
            onChange={(e) => handleInputChange("formula", e.target.value)}
            required
          />
          {errors.formula && (
            <p className="text-red-500 text-sm">{errors.formula}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="chemical">Chemical</Label>
          <Input
            id="chemical"
            name="chemical"
            type="text"
            value={formData.chemical || ""}
            onChange={(e) => handleInputChange("chemical", e.target.value)}
          />
          {errors.chemical && (
            <p className="text-red-500 text-sm">{errors.chemical}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cas">CAS</Label>
          <Input
            id="cas"
            name="cas"
            type="text"
            value={formData.cas || ""}
            onChange={(e) => handleInputChange("cas", e.target.value)}
          />
          {errors.cas && <p className="text-red-500 text-sm">{errors.cas}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cinum">C.I. Number</Label>
          <Input
            id="cinum"
            name="cinum"
            type="text"
            value={formData.cinum || ""}
            onChange={(e) => handleInputChange("cinum", e.target.value)}
          />
          {errors.cinum && (
            <p className="text-red-500 text-sm">{errors.cinum}</p>
          )}
        </div>

        <CategoryComboBoxWithDialog
          label="Brand"
          value={formData.brand}
          onChange={handleBrandChange}
          options={brandOptions}
          type="brand"
        />

        {/* Three-level category selection */}
        <CategoryComboBoxWithDialog
          label="Category"
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoriesOption}
          type="category"
        />

        <CategoryComboBoxWithDialog
          label="Main Category"
          value={formData.maincategory}
          onChange={handleMainCategoryChange}
          options={mainCategoriesOption}
          type="maincategory"
          disabled={!selectedCategoryId}
        />

        <CategoryComboBoxWithDialog
          label="Subcategory"
          value={formData.subcategory}
          onChange={handleSubcategoryChange}
          options={subcategoriesOption}
          type="subcategory"
          disabled={!selectedMainCategoryId}
        />

        <ImageUpload
          images={formData.images}
          setImages={(newImages) => handleInputChange("images", newImages)}
        />
      </div>

      <Button className="w-fit" type="submit">
        {isEditMode ? "Update" : "Save"} Chemical Product
      </Button>

      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && (
        <p className="text-green-500">{submissionSuccess}</p>
      )}
    </form>
  );
}
