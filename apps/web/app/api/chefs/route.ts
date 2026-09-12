import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const cuisine = searchParams.get("cuisine");

  const chefs = await prisma.chef.findMany({
    where: {
      active: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { tagline: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { ratingAvg: "desc" },
  });

  const filtered = cuisine
    ? chefs.filter((c) => (c.cuisineTags as string[]).includes(cuisine))
    : chefs;

  return NextResponse.json(filtered);
}
