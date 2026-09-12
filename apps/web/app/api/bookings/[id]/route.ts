import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

// PUBLIC: fetch a single booking (used on the confirmation page)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { chef: { select: { name: true, photoUrl: true, slug: true } } },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json(booking);
}

// ADMIN: update booking status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { status } = z
      .object({ status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"]) })
      .parse(await req.json());

    const booking = await prisma.booking.update({ where: { id: params.id }, data: { status } });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
