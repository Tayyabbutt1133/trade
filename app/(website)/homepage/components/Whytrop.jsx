import { BsBuilding } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { GiChemicalDrop } from 'react-icons/gi'
import Container from '@/components/container'
import { fonts } from '@/components/ui/font'

export default function FeaturesSection() {
  const features = [
    {
      icon: <BsBuilding className="w-12 h-12 text-gray-700" />,
      title: "Instant access to the most comprehensive product catalog",
      description: "Browse, search and filter the world's largest catalog of chemicals, ingredients and polymers.",
    },
    {
      icon: <HiOutlineDocumentText className="w-12 h-12 text-gray-700" />,
      title: "Talk directly to suppliers' experts",
      description: "Ask technical product questions, talk to a sales rep and inquire about pricing.",
    },
    {
      icon: <GiChemicalDrop className="w-12 h-12 text-gray-700" />,
      title: "Order samples, request documents, and get quotes",
      description: "Knowde concierge will handle all the details and ensure your requests are handled faster than ever.",
    },
  ]

  return (
      <section className="px-4 z-0 py-16 relative mt-10">
        <Container>
      <div className="space-y-12">
        <div className="">
          <h2 className={`text-gray-600 mb-4 ${fonts.roboto}`}>Why TradeTroppers</h2>
            <h3 className={`md:text-4xl leading-[48px] text-3xl max-w-[560px] md:max-w-[70%] ${fonts.montserrat} font-semibold leading-tight text-gray-900`}>
            Interact with over 8,000 suppliers, browse their catalogs, access documents and download starter formulations.
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

