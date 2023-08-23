import prismaDb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const completedOrders = await prismaDb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = completedOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderTotal, orderItem) => {
      return orderTotal + orderItem.product.price.toNumber();
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
