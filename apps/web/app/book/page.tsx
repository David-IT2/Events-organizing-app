import { prisma } from "@/lib/prisma";
import EventBookingForm from "@/components/EventBookingForm";

export default async function BookLandingPage() {
  const chef = await prisma.chef.findFirst({
    where: { active: true },
    orderBy: { ratingAvg: "desc" },
    select: { id: true },
  });

  if (!chef) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-white">Booking is unavailable</h1>
        <p className="mt-3 text-white/70">
          Please check back soon while we prepare our event booking options.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <EventBookingForm defaultChefId={chef.id} />
    </div>
  );
}
