import prismaDb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const isArchived = searchParams.get("isArchived");

    if (!params.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log("[PRODUCTS_GET]", err);
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
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived,
      isFeatured,
    } = body;
    console.log(body);
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!images || images.length === 0)
      return new NextResponse("At least one image is required", {
        status: 400,
      });

    if (!price) return new NextResponse("Price is required", { status: 400 });

    if (!categoryId)
      return new NextResponse("Category is required", { status: 400 });

    if (!colorId) return new NextResponse("Color is required", { status: 400 });

    if (!sizeId) return new NextResponse("Size is required", { status: 400 });

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

    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isArchived,
        isFeatured,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCTS_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
