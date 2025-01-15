export const menuData = {
  sidebar: [
    { id: "industries", icon: "🏭", label: "Industries" },
    { id: "products", icon: "📦", label: "Products" },
    { id: "cosmetic-ingredients", icon: "💄", label: "Cosmetic Ingredients" },
    { id: "food-ingredients", icon: "🍽️", label: "Food Ingredients" },
    { id: "case-ingredients", icon: "🧪", label: "CASE Ingredients" },
    { id: "plastics", icon: "🧊", label: "Plastics" },
  ],
  megaMenu: {
    industries: {
      title: "Industries",
      categories: [
        { title: "Chemical", items: ["Specialty Chemicals", "Petrochemicals", "Agrochemicals", "Polymers"] },
        { title: "Personal Care", items: ["Skincare", "Haircare", "Cosmetics", "Fragrances"] },
        { title: "Food & Beverage", items: ["Ingredients", "Additives", "Flavorings", "Preservatives"] },
        { title: "Industrial", items: ["Automotive", "Construction", "Electronics", "Textiles"] }
      ]
    },
    products: {
      title: "Products",
      categories: [
        { title: "Raw Materials", items: ["Chemicals", "Minerals", "Metals", "Polymers"] },
        { title: "Ingredients", items: ["Food Additives", "Cosmetic Actives", "Pharmaceutical Excipients"] },
        { title: "Formulations", items: ["Paints", "Adhesives", "Cleaning Products", "Personal Care Products"] },
        { title: "Equipment", items: ["Processing Equipment", "Laboratory Equipment", "Safety Equipment"] }
      ]
    },
    "cosmetic-ingredients": {
      title: "Cosmetic Ingredients",
      categories: [
        { title: "Skincare", items: ["Hyaluronic Acid", "Vitamin C", "Retinol", "Collagen"] },
        { title: "Haircare", items: ["Keratin", "Argan Oil", "Biotin", "Caffeine Extract"] }
      ]
    },
    "food-ingredients": {
      title: "Food Ingredients",
      categories: [
        { title: "Natural Ingredients", items: ["Stevia", "Vanilla Extract", "Turmeric", "Paprika"] },
        { title: "Preservatives", items: ["Sodium Benzoate", "Potassium Sorbate", "Citric Acid"] }
      ]
    },
    "case-ingredients": {
      title: "CASE Ingredients",
      categories: [
        { title: "Coatings", items: ["Epoxy Resins", "Acrylic Polymers", "Polyurethane"] },
        { title: "Adhesives", items: ["Hot Melt Adhesives", "Epoxy Adhesives", "Silicone Sealants"] }
      ]
    },
    plastics: {
      title: "Plastics",
      categories: [
        { title: "Thermoplastics", items: ["Polyethylene", "Polypropylene", "Polystyrene"] },
        { title: "Thermosetting Plastics", items: ["Epoxy", "Melamine", "Polyester Resins"] }
      ]
    }
  }
};
