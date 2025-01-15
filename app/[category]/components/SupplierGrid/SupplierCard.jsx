import Image from "next/image";

export default function SupplierCard({ supplier }) {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-20 w-20 relative">
        <Image
          src={supplier.logo}
          alt={supplier.name}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xs text-left font-medium max-w-fit">{supplier.name}</span>
    </div>
  )
}