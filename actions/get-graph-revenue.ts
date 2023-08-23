import prismaDb from "@/lib/prismadb";

interface GraphData {
  name: string;
  revenue: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismaDb.order.findMany({
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

  const monthlyRevenue: { [key: number]: number } = {};

  paidOrders.forEach((order) => {
    const month = order.createdAt.getMonth();
    let revForOrder = 0;
    order.orderItems.forEach((orderItem) => {
      revForOrder += orderItem.product.price.toNumber();
    });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revForOrder;
  });

  const graphData: GraphData[] = [
    { name: "January", revenue: 0 },
    { name: "February", revenue: 0 },
    { name: "March", revenue: 0 },
    { name: "April", revenue: 0 },
    { name: "May", revenue: 0 },
    { name: "June", revenue: 0 },
    { name: "July", revenue: 0 },
    { name: "August", revenue: 0 },
    { name: "September", revenue: 0 },
    { name: "October", revenue: 0 },
    { name: "November", revenue: 0 },
    { name: "December", revenue: 0 },
  ];

  Object.keys(monthlyRevenue).forEach((month) => {
    graphData[Number(month)].revenue = monthlyRevenue[Number(month)];
  });

  return graphData;
};
