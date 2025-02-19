import { fonts } from "@/components/ui/font";
import ProductCard from "../../../components/ProductCard";
import ProductTabsFilter from "./ProductTabFilter";

export default function SidebarProductsGrid({ heading, productdata }) {
  console.log("Data for cards:", productdata);

  return (
    <div className={`${fonts.montserrat}`}>
      <ProductTabsFilter />
      <div className="p-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Products in {heading}
        </h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {productdata?.map((product) => (
            <ProductCard key={product.id} productdata={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
