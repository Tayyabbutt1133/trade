"use client";

import {
  Store,
  FlaskRoundIcon as Flask,
  Tags,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

export default function SideProduct({ productdetails }) {
  const singleproduct =
    productdetails && productdetails.length > 0 ? productdetails[0] : null;
  console.log("Product details in sidebar :", productdetails);
  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto h-screen">
      {/* Main Storefront */}
      <div className="bg-[#37BFB1] text-white rounded-lg shadow-sm">
        <nav>
          <Link href="/" passHref>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start gap-3 font-medium rounded-none transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
            >
              <div>
                <Store className="h-4 w-4" />
                Storefront
              </div>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
          >
            <Flask className="h-4 w-4" />
            Products
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 font-medium rounded-none transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
          >
            <Tags className="h-4 w-4" />
            Brands
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
                className="w-full justify-between font-medium transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
              >
                Technologies
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4"></CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between font-medium transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
              >
                Markets
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4"></CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#37BFB1] text-white rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          QUICK ACTIONS
        </h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
          >
            Request Sample
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-medium transition-transform duration-200 hover:scale-105 hover:bg-transparent hover:text-inherit"
          >
            Request Document
          </Button>
        </div>
      </div>
    </div>
  );
}
