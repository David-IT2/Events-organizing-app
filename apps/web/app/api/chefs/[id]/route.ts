import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

// PUBLIC: fetch a chef's full profile by slug
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const chef = await prisma.chef.findUnique({
    where: { slug: params.id },
    include: { menus: true, gallery: true, reviews: { orderBy: { createdAt: "desc" } } },
  });

  if (!chef || !chef.active) {
    return NextResponse.json({ error: "Chef not found" }, { status: 404 });
  }

  return NextResponse.json(chef);
}

// ADMIN: toggle a chef's active/visible status (id here is the chef's database id)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { active } = z.object({ active: z.boolean() }).parse(await req.json());
    const chef = await prisma.chef.update({ where: { id: params.id }, data: { active } });
    return NextResponse.json(chef);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
