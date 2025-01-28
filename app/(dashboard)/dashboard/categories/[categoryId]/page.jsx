import { CategoryForm } from "../components/CategoryForm"; 


const CategoryFormPage = async ({ params }) => {
  const categoryId = (await params).categoryId;
  const isNewCategory = categoryId === "new";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {isNewCategory ? "Add New Category" : "Edit Category"}
      </h1>
      <div>
        <CategoryForm />
      </div>
    </div>
  );
};

export default CategoryFormPage;
