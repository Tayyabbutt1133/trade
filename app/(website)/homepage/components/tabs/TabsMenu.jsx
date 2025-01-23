import Container from "@/components/container";
import { fonts } from "@/components/ui/font";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IndustriesGrid from "./components/IndustriesGrid";
import ProductFamiliesGrid from "./components/ProductFamilyGrid";

export default function TabsMenu() {
  return (
    <section className="">
    <Container className="mt-10">
      <Tabs defaultValue="industries">
        <TabsList className={fonts.montserrat}>
          <TabsTrigger value="industries" className={`${fonts.montserrat}`}>
            Industries
          </TabsTrigger>
          <TabsTrigger value="product-families" className={fonts.montserrat}>
            Product Families
          </TabsTrigger>
        </TabsList>
        <TabsContent value="industries" className={`${fonts.montserrat}`}>
          <IndustriesGrid />
        </TabsContent>
        <TabsContent value="product-families" className={fonts.montserrat}>
          <ProductFamiliesGrid />
        </TabsContent>
      </Tabs>
      </Container>
      </section>
  );
}
