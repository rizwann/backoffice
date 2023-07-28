import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaDb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") globalThis.prisma = prismaDb;

export default prismaDb;
