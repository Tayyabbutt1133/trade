'use client'

import { Share, FileText, Clock, Building2, Globe } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuoteCard() {
  return (
    <Card className="w-full sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] h-fit">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Get a Quote</CardTitle>
          <Badge variant="secondary" className="bg-teal-50 text-teal-600 hover:bg-teal-50">
            <span className="mr-1">⚡</span> Fast Response
          </Badge>
        </div>
        <Button variant="ghost" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Quantity Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Order Quantity</label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              placeholder="Volume" 
              className="flex-1"
            />
            <Select>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="kg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-teal-500 hover:bg-teal-600">
            Request a Quote
          </Button>
          <Button variant="secondary" className="w-full">
            Request Sample
          </Button>
        </div>

        {/* Info Items */}
        <div className="space-y-4 pt-4">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Minimum Order Quantity</p>
              <p className="text-sm text-muted-foreground">Quote Required</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Lead Time</p>
              <p className="text-sm text-muted-foreground">Quote Required</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Incoterms</p>
              <p className="text-sm text-muted-foreground">Quote Required</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Regional Availability</p>
              <p className="text-sm text-muted-foreground">Quote Required</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
