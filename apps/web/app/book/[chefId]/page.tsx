import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingWizard from "@/components/BookingWizard";
import type { ChefDetail } from "@/lib/types";

export default async function BookPage({ params }: { params: { chefId: string } }) {
  const chef = await prisma.chef.findUnique({
    where: { id: params.chefId },
    include: { menus: true, gallery: true, reviews: true },
  });

  if (!chef || !chef.active) return notFound();

  const chefDetail = {
    ...chef,
    cuisineTags: chef.cuisineTags as string[],
    menus: chef.menus.map((m) => ({ ...m, courses: m.courses as any })),
  } as unknown as ChefDetail;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <BookingWizard chef={chefDetail} />
    </div>
  );
}
