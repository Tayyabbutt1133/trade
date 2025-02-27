import { fonts } from "@/components/ui/font";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductCard({ product }) {
  // If there's no product, return null
  if (!product) return null;

  // console.log("Checking single product in ProductCard:", product);

  return (
    <div
      className={`flex flex-col justify-between h-full bg-white rounded-lg shadow-md ${fonts.montserrat}`}
    >
      {/* 
         If your API uses `product` as the name (e.g. "Bismuth Black"), 
         you might link by ID or some slug. For now, using `product.product`.
      */}
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <section className="h-32  bg-sky-100 relative">
            <Image
              src="/placeholder.svg?height=128&width=400"
              alt="product"
              fill
              className="object-cover"
            />
          </section>
          <section className="absolute bottom-0 left-4 -mb-8">
            <div className="bg-white rounded-lg p-2 shadow-sm w-16 h-16 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="product"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col flex-grow p-4 pt-12 space-y-4">
          <div className="flex-grow space-y-4">
            <div>
              <p className="text-sm text-gray-600">{product.brand}</p>
              {/* If your API field is `product` for the name */}
              <h3 className="font-semibold text-lg">{product.product}</h3>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Formula:</p>
                <p className="text-sm">{product.formula}</p>
              </div>

              {product.category && (
                <div>
                  <p className="text-sm text-gray-600">Category:</p>
                  <p className="text-sm">{product.category}</p>
                </div>
              )}

              {product.subcategory && (
                <div>
                  <p className="text-sm text-gray-600">Subcategory:</p>
                  <p className="text-sm">{product.subcategory}</p>
                </div>
              )}

              {product.code && (
                <div>
                  <p className="text-sm text-gray-600">Code:</p>
                  <p className="text-sm">{product.code}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full py-2 text-center text-sm bg-slate-200 text-black hover:bg-gray-50 transition-colors">
              View Product
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
