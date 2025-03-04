// File: /app/dashboard/products/[productId]/page.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "../components/ProductForm";
import { DescriptionListForm } from "../components/DescriptionListForm";
import { FileUploadForm } from "../components/FileUploadForm";
import PropertyTable from "../components/PropertyTable";

export default async function ProductDetail({ params }) {
  const productId = (await params).productId;
  const isNewProduct = productId === "new";

  // Fetch options data - only fetch brands and categories initially
  const [brandRes, categoriesRes] = await Promise.all([
    fetch("https://tradetoppers.esoftideas.com/esi-api/responses/brand/"),
    fetch("https://tradetoppers.esoftideas.com/esi-api/responses/categories/"),
  ]);
  const [brands, categories] = await Promise.all([
    brandRes.json(),
    categoriesRes.json(),
  ]);

  // If editing existing product, fetch its data
  let productData = null;
  let productSpecs = null
  if (!isNewProduct) {
    try {
      const formData = new FormData();
      formData.append("productid", productId);
      formData.append("maincatid", "0");
      formData.append("catid", "0");
      formData.append("subcatid", "0");
      formData.append("logby", "0");
      
      const response = await fetch(
        "https://tradetoppers.esoftideas.com/esi-api/responses/products/",
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      if (data && data.Product && data.Product.length > 0) {
        productData = data.Product[0];
      }
      if (data && data["Product Specs"] && data["Product Specs"].length > 0) {
        productSpecs = data["Product Specs"]
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {isNewProduct ? "Add Product" : "Edit Product"}
      </h1>
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger value="product" className="flex-1 min-w-[80px]">
            <span className="hidden sm:inline">Product</span>
            <span className="sm:hidden">Prod</span>
          </TabsTrigger>
          {/* <TabsTrigger value="details" className="flex-1 min-w-[80px]">
              Details
          </TabsTrigger> */}
          <TabsTrigger value="document" className="flex-1 min-w-[80px]">
            <span className="hidden sm:inline">Document</span>
            <span className="sm:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="specification" className="flex-1 min-w-[80px]">
            <span className="hidden sm:inline">Specification</span>
            <span className="sm:hidden">Specs</span>
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="product">
            <ProductForm
              initialBrandOptions={brands.Brand}
              initialCategoriesOption={categories.Categories}
              initialData={productData}
              productId={productId}
            />
          </TabsContent>
          <TabsContent value="details">
            <DescriptionListForm
              productId={productId}
              initialData={productData}
            />
          </TabsContent>
          <TabsContent value="document">
            <FileUploadForm />
          </TabsContent>
          <TabsContent value="specification">
            <PropertyTable initialData={productSpecs}/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}