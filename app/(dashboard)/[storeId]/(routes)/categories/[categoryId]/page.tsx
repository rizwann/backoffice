import prismaDb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const category = await prismaDb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
