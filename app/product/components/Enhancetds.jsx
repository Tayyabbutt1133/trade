import { SectionCard } from "./Section-card"
import { fonts } from "@/components/ui/font"

export default function Enhancetds() {
  const productData = {
    title: "Enhanced TDS",
    description: "Principal enriched technical product data sheet",
    chemicalFamily: {
      name: "Agrochemical",
      items: ["Biocarboncer"]
    },
    technologies: ["Agrochemistry"],
    productFamilies: ["Agrochemicals - Adjuvants & Formulation Ingredients", "Biocarbonces"],
    features: [{
      category: "Agrochemicals Features",
      items: ["Ready-to-use"]
    }],
    applications: {
      markets: ["Agriculture & Feed"],
      types: [
        "Agriculture & Feed - Pest Control",
        "Agriculture Pest Control"
      ]
    },
    productApplications: ["Adjuvant Additives Ready-To-Use (RTU) Tech Mix Adjuvants"],
    properties: {
      physicalForm: "Liquid"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className={`text-primary text-lg sm:text-xl ${fonts.montserrat}`}>E</span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold ${fonts.montserrat}`}>{productData.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <SectionCard title="Identification & Functionality">
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium text-muted-foreground mb-2 ${fonts.montserrat}`}>Chemical Family</h3>
                  <ul className="space-y-1">
                    {productData.chemicalFamily?.items.map((item, i) => (
                      <li key={i} className={`text-sm ${fonts.montserrat}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className={`text-sm font-medium text-muted-foreground mb-2 ${fonts.montserrat}`}>Technologies</h3>
                  <ul className="space-y-1">
                    {productData.technologies?.map((tech, i) => (
                      <li key={i} className={`text-sm ${fonts.montserrat}`}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Features & Benefits">
              <div className="space-y-4">
                {productData.features?.map((feature, i) => (
                  <div key={i}>
                    <h3 className={`text-sm font-medium text-muted-foreground mb-2 ${fonts.montserrat}`}>{feature.category}</h3>
                    <ul className="space-y-1">
                      {feature.items.map((item, j) => (
                        <li key={j} className={`text-sm ${fonts.montserrat}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <SectionCard title="Applications & Uses">
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium text-muted-foreground mb-2 ${fonts.montserrat}`}>Markets</h3>
                  <ul className="space-y-1">
                    {productData.applications?.markets.map((market, i) => (
                      <li key={i} className={`text-sm ${fonts.montserrat}`}>{market}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Properties">
              <div className="space-y-4">
                <div>
                  <h3 className={`text-sm font-medium text-muted-foreground mb-2 ${fonts.montserrat}`}>Physical Form</h3>
                  <p className={`text-sm ${fonts.montserrat}`}>{productData.properties?.physicalForm}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}