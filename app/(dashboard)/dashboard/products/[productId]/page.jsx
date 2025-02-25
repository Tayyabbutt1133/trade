// File: /app/dashboard/products/[productId]/page.jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "../components/ProductForm";
import { DescriptionListForm } from "../components/DescriptionListForm";
// import { getProductById } from "@/lib/getProductById";

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

  // For subcategories, we'll fetch them dynamically based on the selected category
  // We won't fetch them initially

  // If editing existing product, fetch its data

  let productData = null;
  if (!isNewProduct) {
    try {
      const formData = new FormData();
      formData.append("productid", productId);

      productData = await fetch(
        "https://tradetoppers.esoftideas.com/esi-api/responses/products/",
        {
          method: "POST",
          body: formData,
        }
      );
      productData = await productData.json()
      productData = productData.Product[0]

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
        <TabsList className="flex w-full max-w-md overflow-x-auto">
          <TabsTrigger value="product" className="flex-1 min-w-[80px]">
            <span className="hidden sm:inline">Product</span>
            <span className="sm:hidden">Prod</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 min-w-[80px]">
            Details
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
        </div>
      </Tabs>
    </div>
  );
}
