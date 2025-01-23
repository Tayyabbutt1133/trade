"use client";

import {
  Store,
  FlaskRoundIcon as Flask,
  Tags,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import chem_logo from "@/public/chemicalbg.png";
import { fonts } from "@/components/ui/font";

export default function SideProduct({
  industry,
  productCount = 15,
  brandCount = 1,
}) {
  return (
    <div className="overflow-x-scroll   md:min-h-screen p-4 bg-slate-100 flex flex-row md:flex-col gap-4">
      {/* Logo */}
      <div className="p-4">
        {/* <Image 
          src={chem_logo}
          width={25}
          height={40}
          alt="Central Glass" 
          className="h-8"
        /> */}
        <h1 className={`text-black text-2xl ${fonts.montserrat}`}>
          {industry}
        </h1>
      </div>

      
      {/* Main Storefront */}
      <div className="bg-[#37BFB1] text-white rounded-lg shadow-sm">
        <nav className="">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none"
          >
            <Store className="h-4 w-4" />
            Storefront
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none"
          >
            <Flask className="h-4 w-4" />
            Products
            <span className="ml-auto text-muted-foreground text-sm">
              {productCount}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none"
          >
            <Tags className="h-4 w-4" />
            Brands
            <span className="ml-auto text-muted-foreground text-sm">
              {brandCount}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </nav>
      </div>

      {/* Browse By Section */}
      <div className="bg-[#37BFB1] text-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          BROWSE BY
        </h3>
        <div className="space-y-1">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-medium"
              >
                Technologies
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              {/* Add technology items here */}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-medium"
              >
                Markets
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              {/* Add market items here */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#37BFB1] text-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          QUICK ACTIONS
        </h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start font-medium">
            Request Sample
          </Button>
          <Button variant="ghost" className="w-full justify-start font-medium">
            Request Document
          </Button>
        </div>
      </div>


    </div>
  );
}
