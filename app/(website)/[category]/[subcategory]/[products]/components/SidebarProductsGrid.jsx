import { fonts } from "@/components/ui/font";
import ProductCard from "../../../components/ProductCard";
import ProductTabsFilter from "./ProductTabFilter";

export default function SidebarProductsGrid({ category, products }) {
  console.log("Data for cards:", products);

  return (
    <div className={`${fonts.montserrat}`}>
      <ProductTabsFilter />
      <div className="p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Products in {category}
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} products={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
