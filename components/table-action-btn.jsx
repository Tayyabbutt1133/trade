import Link from "next/link";
import React from "react";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";


const TableActionBtn = ({href, data}) => {
  return (
    <Link href={`/dashboard/${href}/${data.id}`}>
      <Button
        size="icon"
        variant="outline"
        asChild
      >   
        <Edit className="mr-2 h-4 w-4" />
      </Button>
    </Link>
  );
};

export default TableActionBtn;
