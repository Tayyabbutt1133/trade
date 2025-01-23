import { fonts } from "@/components/ui/font";
import ProductCard from "./ProductCard";
import ProductCategoryCard from "./ProductCategoryCard";
import Link from "next/link";

export default function ProductsGrid({ products, category, totalProducts }) {
  return (
    <div className={fonts.montserrat}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Browse All Products in {category} ({totalProducts.toLocaleString()})
      </h1>

      {/* catch all route here  */}
      <Link href={`/product/${category}`}>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {/* Mobile: Only show category card */}
        <div className="sm:hidden col-span-1">
          <ProductCategoryCard
            title={category}
            productCount={totalProducts}
            imageUrl="/building 1.jpg"
            imageAlt={`${category} category`}
            href={`/categories/${category.toLowerCase()}`}
          />
        </div>

        {/* Small screens: Show 1 product + category card */}
        <div className="hidden sm:block md:hidden">
          <ProductCard product={products[0]} />
        </div>

        {/* Medium screens: Show 5 products +a category card */}
        <div className="hidden md:contents lg:hidden">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Large screens: Show 9 products + category card */}
        <div className="hidden lg:contents">
          {products.slice(0, 9).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Category card for non-mobile screens */}
        <div className="hidden sm:block col-span-1 sm:col-start-2 md:col-start-auto">
          <ProductCategoryCard
            title={category}
            productCount={totalProducts}
            imageUrl="/building 1.jpg"
            imageAlt={`${category} category`}
            href={`/categories/${category.toLowerCase()}`}
          />
        </div>
        </div>
        </Link>
    </div>
  );
}
