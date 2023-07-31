import prismaDb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string };
}
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div>
      <h1>Active Store name: {store?.name}</h1>
    </div>
  );
};

export default DashboardPage;
