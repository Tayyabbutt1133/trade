import React from "react";
import SideProduct from "../components/SideProduct";
import ProductDetails from "../components/ProductDetail";
import Enhancetds from "../components/Enhancetds";

const page = async ({ params }) => {
    const {product} = await params
  return (
    <>
      
      <div className="flex md:flex-row flex-col">
        <div>
          <SideProduct industry={product} />
        </div>
        <div>
          <ProductDetails producttitle={product} />
          <Enhancetds/>
          </div>
      </div>
    </>
  );
};

export default page;
