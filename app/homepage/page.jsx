import React from "react";
import Hero from "./components/hero/Hero";
import TabsMenu from "./components/tabs/TabsMenu";
import FeaturesSection from "./components/Whytrop";
import FeaturedSuppliers from "./components/Feature-Supplier";
import Whychem from "./components/Whychem";
import ActivityFeed from "./components/Activity-feed";
import TestimonialCarousel from "@/app/homepage/components/testimonial/Testimonial";
import SuppliersSection from "./components/suppliers/suppliers";
import InsightsAndInnovations from "./components/insightsAndInnovations/InsightsAndInnovations";

const HomePage = () => {
  return (
    <>
      <Hero />
      <TabsMenu />
      <FeaturesSection />
      <FeaturedSuppliers />
      <Whychem />
     <TestimonialCarousel/>
      <ActivityFeed/>
      <InsightsAndInnovations />
      <SuppliersSection/>
    </>
  );
};

export default HomePage;
