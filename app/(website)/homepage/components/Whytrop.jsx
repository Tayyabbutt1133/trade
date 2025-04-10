import { BsBuilding } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { GiChemicalDrop } from 'react-icons/gi'
import { FaFirstOrder } from "react-icons/fa6";
import Container from '@/components/container'
import { fonts } from '@/components/ui/font'

export default function FeaturesSection() {
  const features = [
    {
      icon: <BsBuilding className="w-12 h-12 text-gray-700" />,
      title: "Get up to date access to the most complete products by the manufacturers",
      description: "Browse, search and filter the manufacturers catalog of chemicals, ingredients and polymers",
    },
    {
      icon: <HiOutlineDocumentText className="w-12 h-12 text-gray-700" />,
      title: "Send quotation directly to the suppliers or manufacturers",
      description: "Checkout latest pricing and chemicals technical questions or talk to our experts.",
    },
    {
      icon: <FaFirstOrder className="w-12 h-12 text-gray-700" />,
      title: "Create Orders or verify documents and get quotes",
      description: "Check products range by the suppliers and manufacturers around the globe.",
    },
  ]

  return (
      <section className="px-4 z-0 py-16 relative mt-10">
        <Container>
      <div className="space-y-12">
        <div className="">
          <h2 className={`text-gray-600 mb-4 ${fonts.montserrat}`}>Connect with suppliers around the globe, explore their catalogs, access essential documents</h2>
            <h3 className={`md:text-4xl drop-shadow-[2px_2px_1px_rgba(0,0,0,0.2)] leading-[48px] text-3xl max-w-[560px] md:max-w-[70%] ${fonts.montserrat} font-semibold leading-tight text-gray-900`}>
            Reach out suppliers, explore their catalogs and access documents.
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative z-10">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
          </div>
          </Container>
    </section>
  )
}

