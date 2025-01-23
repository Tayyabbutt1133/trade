export const filterSections = [
    {
      id: 'show-products',
      title: 'SHOW PRODUCTS WITH',
      type: 'switches',
      items: [
        { id: 'sds', label: 'With SDS' },
        { id: 'tds', label: 'With TDS' }
      ]
    },
    {
      id: 'identification',
      title: 'IDENTIFICATION',
      type: 'menu',
      items: [
        { 
          id: 'chemical-family',
          label: 'Chemical Family',
          options: [
            { label: "Nitrogen-based Compounds", count: 192 },
            { label: "Potassium Salts", count: 154 },
            { label: "Phosphorous-based Compounds", count: 109 },
            { label: "Zinc & Zinc Compounds", count: 77 },
            { label: "Phosphates", count: 57 },
            { label: "Sulfur-based Compounds", count: 57 },
            { label: "Magnesium & Magnesium Compounds", count: 56 },
            { label: "Urea & Urea Derivatives", count: 52 },
            { label: "Copper-based Compounds", count: 46 },
            { label: "Copper Salts", count: 39 },
            { label: "Humic Acids", count: 35 },
            { label: "Ammonium Compounds", count: 34 },
            { label: "Iron & Iron Compounds", count: 32 },
            { label: "Manganese & Manganese Compounds", count: 32 },
            { label: "Blends & Combinations", count: 29 },
            { label: "Boron-based Compounds", count: 29 },
            { label: "Calcium Salts", count: 26 },
            { label: "Organophosphates", count: 23 }
          ]
        },
        { 
          id: 'chemical-name',
          label: 'Chemical Name',
          options: [] // Add options as needed
        },
        { 
          id: 'crop-plant-type',
          label: 'Crop & Plant Type',
          options: [] // Add options as needed
        }
      ]
    },
    {
      id: 'functions',
      title: 'FUNCTIONS',
      type: 'menu',
      items: [
        { 
          id: 'agrochemical-functions',
          label: 'Agrochemical Functions',
          options: [] // Add options as needed
        }
      ]
    },
    {
      id: 'benefits-claims',
      title: 'BENEFITS & CLAIMS',
      type: 'menu',
      items: [
        { 
          id: 'labeling-claims',
          label: 'Labeling Claims',
          options: [] // Add options as needed
        }
      ]
    },
    {
      id: 'features',
      title: 'FEATURES',
      type: 'menu',
      items: [
        { 
          id: 'agrochemicals-features',
          label: 'Agrochemicals Features',
          options: [] // Add options as needed
        }
      ]
    },
    {
      id: 'applications',
      title: 'APPLICATIONS',
      type: 'menu',
      items: [
        { 
          id: 'applicable-crop',
          label: 'Applicable Crop',
          options: [] // Add options as needed
        },
        { 
          id: 'application-technique',
          label: 'Application Technique',
          options: [] // Add options as needed
        }
      ]
    },
    {
      id: 'packaging-availability',
      title: 'PACKAGING & AVAILABILITY',
      type: 'menu',
      items: [
        { 
          id: 'country-availability',
          label: 'Country Availability',
          options: [] // Add options as needed
        }
      ]
    }
  ]
  
  