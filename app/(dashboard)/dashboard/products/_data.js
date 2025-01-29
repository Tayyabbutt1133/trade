export const formFields = [
    { id: "product-name", label: "Name", type: "text" },
    { id: "product-description", label: "Description", type: "textarea" },
    { id: "product-code", label: "Code", type: "text" },
    { id: "product-formula", label: "Formula", type: "text" },
  ]
  
  export const existingFunctions = [
    "Solvent",
    "Catalyst",
    "Reagent",
    "pH Regulator",
    "Oxidizing Agent",
    "Reducing Agent",
    "Stabilizer",
    "Emulsifier",
    "Surfactant",
    "Chelating Agent",
  ]
  
  export const mainCategories = [
    { value: "organic", label: "Organic Chemicals" },
    { value: "inorganic", label: "Inorganic Chemicals" },
    { value: "polymers", label: "Polymers" },
  ]
  
  export const subCategories = {
    organic: [
      { value: "alcohols", label: "Alcohols" },
      { value: "aldehydes", label: "Aldehydes" },
      { value: "ketones", label: "Ketones" },
    ],
    inorganic: [
      { value: "acids", label: "Acids" },
      { value: "bases", label: "Bases" },
      { value: "salts", label: "Salts" },
    ],
    polymers: [
      { value: "thermoplastics", label: "Thermoplastics" },
      { value: "thermosets", label: "Thermosets" },
      { value: "elastomers", label: "Elastomers" },
    ],
  }
  
  export const subSubCategories = {
    alcohols: [
      { value: "methanol", label: "Methanol" },
      { value: "ethanol", label: "Ethanol" },
      { value: "propanol", label: "Propanol" },
    ],
    aldehydes: [
      { value: "formaldehyde", label: "Formaldehyde" },
      { value: "acetaldehyde", label: "Acetaldehyde" },
      { value: "benzaldehyde", label: "Benzaldehyde" },
    ],
    ketones: [
      { value: "acetone", label: "Acetone" },
      { value: "butanone", label: "Butanone" },
      { value: "acetophenone", label: "Acetophenone" },
    ],
  }
  
  export const brandOptions = [
    { value: "brand1", label: "Brand 1" },
    { value: "brand2", label: "Brand 2" },
    { value: "brand3", label: "Brand 3" },
  ]
  
  