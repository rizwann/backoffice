import prismaDb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    return new NextResponse("Webhook Error: " + e.message, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const name = session?.customer_details?.name;

  const addressString = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.country,
    address?.postal_code,
  ]
    .filter((c) => c !== null)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    console.log(
      `Payment of ${session.amount_total} received from ${name}, ${addressString}`
    );
    const order = await prismaDb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismaDb.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse("OK", { status: 200 });
}
