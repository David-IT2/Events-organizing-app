import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminFromCookies } from "@/lib/auth";

const bookingSchema = z.object({
  chefId: z.string().uuid(),
  menuId: z.string().uuid().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  eventType: z.enum(["INTIMATE_DINNER", "WEDDING", "CORPORATE", "BIRTHDAY", "OTHER"]),
  eventDate: z.string(),
  guestCount: z.number().int().positive(),
  venueStatus: z.string(),
  dietary: z.array(z.string()).default([]),
  notes: z.string().optional(),
  estimatedTotal: z.number().optional(),
});

// PUBLIC: create a booking request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    const booking = await prisma.booking.create({
      data: { ...data, eventDate: new Date(data.eventDate) },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

// ADMIN: list bookings
export async function GET(req: NextRequest) {
  const admin = getAdminFromCookies();
  if (!admin) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const bookings = await prisma.booking.findMany({
    where: status ? { status: status as any } : undefined,
    include: { chef: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
