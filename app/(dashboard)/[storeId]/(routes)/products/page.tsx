import prismaDb from "@/lib/prismadb";
import { priceFormatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismaDb.product.findMany({
    where: {
      storeId: params.storeId,
    },

    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      price: priceFormatter.format(product.price.toNumber()),
      category: product.category.name,
      size: product.size.name,
      color: product.color.value,

      createdAt: format(product.createdAt, "MMM dd, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
