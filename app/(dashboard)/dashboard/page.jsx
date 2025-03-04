import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fonts } from "@/components/ui/font";
import { Users, Package, MessageSquare } from "lucide-react";
import { GETCOUNT } from "@/app/actions/getcount";


export default async function Dashboard() {


  const response = await GETCOUNT();
  const dashboard = response?.Dashboard || [];
  const { sellers, buyers, products, rfq } = dashboard[0];



  return (
    <div className={`${fonts.montserrat} space-y-6`}>
      <h1 className="sm:text-3xl text-2xl font-bold text-center lg:text-left">
        Dashboard Overview
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers}</div>
            {/* <p className="text-xs text-muted-foreground">+12% from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyers}</div>
            {/* <p className="text-xs text-muted-foreground">+8% from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products}</div>
            {/* <p className="text-xs text-muted-foreground">+23 new products</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total RFQ / Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rfq}</div>
            {/* <p className="text-xs text-muted-foreground">-5 from yesterday</p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
