import prismaDb from "@/lib/prismadb";

export const getProductStock = async (storeId: string) => {
  const productcount = await prismaDb.product.count({
    where: {
      storeId,
    },
  });

  return productcount;
};
