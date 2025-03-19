import React from "react";
import SideProduct from "../components/SideProduct";
import ProductDetails from "../components/ProductDetail";
import Enhancetds from "../components/Enhancetds";
import { GETPRODUCT } from "@/app/actions/getproduct";
import Certification from "../components/Certification";

const page = async ({ params }) => {
  const { product } = await params;

  // we are sending catid, maincatid and subcatid to empty because we are sending unique id to get specific product, but api expecting them as empty in order to give sucessfull response
  const catid = "";
  const maincatid = "";
  const subcatid = "";
  const logby = "0";
  const initialSize = 1; // Fetch 1 product just to get total count
  const initialPage = "";

  const fetchproduct = await GETPRODUCT(
    catid,
    maincatid,
    subcatid,
    product,
    logby,
    initialSize,
    initialPage
  );
  // console.log("Response back from server :", fetchproduct);
  const isfetchProductArray = fetchproduct?.data?.Product || [];

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* SideProduct column */}
        <aside className="w-full md:w-64 bg-slate-100">
          <SideProduct productdetails={isfetchProductArray} />
        </aside>

        {/* Main content column (grows to fill) */}
        <main className="flex-1">
          <ProductDetails productdata={isfetchProductArray} />
          <Enhancetds tds={isfetchProductArray} />
          <Certification docs={isfetchProductArray} />
        </main>
      </div>
    </>
  );
};

export default page;
