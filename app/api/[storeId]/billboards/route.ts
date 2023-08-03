import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const billboards = await prismaDb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (err) {
    console.log("[BILLBOARDS_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;
    console.log(body);
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!label) return new NextResponse("Label is required", { status: 400 });

    if (!imageUrl)
      return new NextResponse("Image URL is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const billboard = await prismaDb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARDS_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
