import Link from "next/link";
import React from "react";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";


const TableActionBtn = ({ data, page }) => {
  return (
    <Link href={`/dashboard/${page}/${data.id}`}>
      <Button
        size="sm"
        variant="secondary"
      >   
        <Edit className="h-4 w-4" />
      </Button>
    </Link>
  );
};

export default TableActionBtn;