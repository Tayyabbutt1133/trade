import { fonts } from "@/components/ui/font";
import Image from "next/image";
import { Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
  return (
    <div className={`flex flex-col justify-between h-full bg-white rounded-lg shadow-md ${fonts.montserrat}`}>
      <div className="relative">
        <section className="h-32 bg-sky-100 relative">
          <Image
            src={product.backgroundImage || "/placeholder.svg?height=128&width=400"}
            alt=""
            fill
            className="object-cover"
          />
        </section>
        <section className="absolute bottom-0 left-4 -mb-8">
          <div className="bg-white rounded-lg p-2 shadow-sm w-16 h-16 flex items-center justify-center">
            <Image
              src={product.logo || "/placeholder.svg?height=40&width=40"}
              alt={product.company}
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
            <p className="text-sm text-gray-600">{product.company}</p>
            <h3 className="font-semibold text-lg">{product.name}</h3>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">INCI Name:</p>
              <p className="text-sm">{product.inciName}</p>
            </div>

            {product.functions && (
              <div>
                <p className="text-sm text-gray-600">Functions:</p>
                <p className="text-sm">{product.functions}</p>
              </div>
            )}

            {product.chemicalName && (
              <div>
                <p className="text-sm text-gray-600">Chemical Name:</p>
                <p className="text-sm">{product.chemicalName}</p>
              </div>
            )}

            {product.casNumber && (
              <div>
                <p className="text-sm text-gray-600">CAS Number:</p>
                <p className="text-sm">{product.casNumber}</p>
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
    </div>
  );
}

