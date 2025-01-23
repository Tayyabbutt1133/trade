import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";

export default function ProductCategoryHeader({ category }) {
  return (
    <div className={`flex w-full flex-col md:flex-row md:items-start md:justify-between space-y-6 md:space-y-0 ${fonts.montserrat} mb-6`}>
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-900">
            {category}
          </h1>
          <p className="text-xs text-gray-600">12,861 Products</p>
        </div>

        <p className="text-gray-800 text-sm font-medium max-w-3xl">
          Knowde has a wide range of products essential for the agriculture and
          feed industries including adjuvents, fertilizers, crop protection,
          feed ingredients, and more.
        </p>
      </section>

      <Button className="bg-primary hover:bg-gray-500 text-white text-sm h-auto rounded-md w-fit">
        View All Products
      </Button>
    </div>
  );
}
