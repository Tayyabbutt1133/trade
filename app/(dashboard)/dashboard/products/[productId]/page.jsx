import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductForm } from "../components/ProductForm";
// import { ProductSpecsForm } from "../components/ProductSpecsForm";
import { DescriptionListForm } from "../components/DescriptionListForm";

export default async function ProductDetail({ params }) {
  const productId = (await params).productId;
  const isNewProduct = productId === "new";
  
  
  const [brandRes, subcategoriesRes, categoriesRes] = await Promise.all([
    fetch('https://tradetoppers.esoftideas.com/esi-api/responses/brand/'),
    fetch('https://tradetoppers.esoftideas.com/esi-api/responses/subcategories/'),
    fetch('https://tradetoppers.esoftideas.com/esi-api/responses/categories/')
  ]);
  
  const [brands, subcategories, categories] = await Promise.all([
    brandRes.json(),
    subcategoriesRes.json(),
    categoriesRes.json()
  ]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{isNewProduct ? "Add Product" : "Edit Product"}</h1>
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
            <ProductForm initialBrandOptions={brands.Brand} initialSubcategoriesOption={subcategories.SubCategories} initialCategoriesOption={categories.Categories}/>
          </TabsContent>
          <TabsContent value="details">
            <DescriptionListForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
