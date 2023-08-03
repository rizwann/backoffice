import prismaDb from "@/lib/prismadb";
import { format } from "date-fns";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => {
    return {
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMM dd, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
