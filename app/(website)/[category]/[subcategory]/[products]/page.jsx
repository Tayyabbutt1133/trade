
import SidebarProductsGrid from "./components/SidebarProductsGrid";
import SidebarBreadcrumbs from "./components/SidebarBreadCrumbs";
import FilterDropdowns from "./components/FilterDropdown/FilterDropdown";
import FilterSidebar from "./components/FilterSideBar";

const exampleProducts = [
  {
    id: 1,
    company: "Harcros Chemicals Inc.",
    name: "H-Quest® C 100",
    inciName: "Sodium Gluceptate",
    functions:
      "Dispersant, Set Retarder, Sequestering Agent, Corrosion Inhibitor, Chelating Agent",
    chemicalName: "Sodium glucoheptonate",
    casNumber: "31138-65-5",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 2,
    company: "Harcros Chemicals Inc.",
    name: "H-Quest® L50 LA",
    inciName: "Sodium Decyl Sulfate",
    chemicalName: "Sodium glucoheptonate",
    casNumber: "31138-65-5",
    functions: "Biodegradable, Non-Corrosive",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 3,
    company: "Harcros Chemicals Inc.",
    name: "H-Quest® B 105",
    inciName: "Sodium Gluceptate",
    chemicalName: "Sodium glucoheptonate",
    casNumber: "31138-65-5",
    functions: "Sequestering Agent, Corrosion Inhibitor",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 4,
    company: "ADM",
    name: "ADM Fully Hydrogenated Soybean Oil (VGB4)",
    inciName: "Hydrogenated Soybean Oil",
    ingredientName: "Hydrogenated Soybean Oil",
    ingredientOrigin: "Natural Origin, Plant Origin, Vegetable Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 5,
    company: "ADM",
    name: "ADM Fully Hydrogenated Rapeseed Oil (VGB6)",
    inciName: "Hydrogenated Rapeseed Oil",
    ingredientName: "Rapeseed Oil, Hydrogenated",
    ingredientOrigin: "Natural Origin, Plant Origin, Vegetable Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 6,
    company: "ADM",
    name: "ADM Fully Hydrogenated High Erucic Acid Rapeseed Oil (VGB22)",
    inciName: "Hydrogenated Rapeseed Oil",
    ingredientName: "Rapeseed Oil, Hydrogenated",
    ingredientOrigin: "Natural Origin, Plant Origin, Vegetable Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 7,
    company: "ADM",
    name: "ADM Fully Hydrogenated Sunflower Oil (WGBS S1)",
    inciName: "Hydrogenated Sunflower Seed Oil",
    ingredientName: "Hydrogenated Sunflower Oil",
    ingredientOrigin: "Natural Origin, Plant Origin, Vegetable Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 8,
    company: "ADM",
    name: "ADM Partially Hydrogenated Rapeseed Oil (Organic) (GV50 BIO)",
    inciName: "Hydrogenated Rapeseed Oil",
    functions: "Emollient, Texturizing Agent, Viscosity Modifier",
    ingredientOrigin: "Vegetable Origin, Natural Origin, Plant Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
  {
    id: 9,
    company: "ADM",
    name: "ADM Fully Hydrogenated Palm Kernel Oil (GV38/40)",
    inciName: "Hydrogenated Palm Kernel Oil",
    functions: "Viscosity Modifier, Texturizing Agent",
    ingredientOrigin: "Vegetable Origin, Natural Origin, Plant Origin",
    logo: "/Anderson Logo Homepage.webp",
    backgroundImage: "/building 2.jpg",
  },
];

const Page = async ({ params }) => {
  const { products, category, subcategory } = await params;

  return (
    <div className="flex min-h-screen">
      <FilterSidebar />
      <main className="flex-1 my-10 mx-2">
        <SidebarBreadcrumbs
          category={category}
          subcategory={subcategory}
          products={products}
        />
        <FilterDropdowns />
        <SidebarProductsGrid
          products={exampleProducts}
          category={products}
          totalProducts={4166}
        />
      </main>
    </div>
  );
};

export default Page;
