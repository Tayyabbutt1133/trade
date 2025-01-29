

export const columns  = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "parentCategory", header: "Parent Category" },
  { accessorKey: "createdDate", header: "Created Date" },
]

export const categories = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    parentCategory: "None",
    createdDate: "2024-03-20",
  },
  {
    id: "2",
    name: "Smartphones",
    description: "Mobile phones and accessories",
    parentCategory: "Electronics",
    createdDate: "2024-03-21",
  },
  {
    id: "3",
    name: "Books",
    description: "Physical and digital books",
    parentCategory: "None",
    createdDate: "2024-03-22",
  },
]

