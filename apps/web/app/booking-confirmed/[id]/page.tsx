import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { parseEventServiceNotes } from "@/lib/eventServices";

export default async function BookingConfirmedPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { chef: { select: { name: true } } },
  });

  if (!booking) return notFound();

  const ref = `GG-${new Date(booking.createdAt).getFullYear()}-${booking.id.slice(0, 5).toUpperCase()}`;
  const { serviceLabel } = parseEventServiceNotes(booking.notes);
  const isEventPlanningRequest = Boolean(serviceLabel);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber/40 bg-amber/10">
        <span className="text-2xl text-amber">&#10003;</span>
      </div>
      <h1 className="mt-6 font-display text-3xl text-white">Your Culinary Event is Confirmed!</h1>
      <p className="mt-2 text-sm text-white/70">Booking Reference: {ref}</p>

      <div className="mt-8 border border-white/15 bg-[#1c0216]/80 p-6 text-left rounded-xl backdrop-blur-md shadow-xl text-white">
        <h2 className="font-display text-xl text-white font-semibold">Reservation Summary</h2>
        <p className="mt-3 font-medium text-white text-lg">
          {serviceLabel || booking.chef.name}
        </p>
        <p className="text-sm text-white/70">
          {serviceLabel ? "Event planning request" : EVENT_TYPE_LABELS[booking.eventType]}
        </p>

        <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/70">Event Date</dt>
            <dd className="text-white font-medium">
              {new Date(booking.eventDate).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/70">Guest Count</dt>
            <dd className="text-white font-medium">{booking.guestCount} Guests</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/70">Total Estimated Cost</dt>
            <dd className="text-amber font-semibold text-base">${booking.estimatedTotal?.toFixed(2) ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 text-left border border-white/15 bg-[#1c0216]/80 p-6 rounded-xl backdrop-blur-md shadow-xl text-white">
        <h2 className="font-display text-xl text-white font-semibold">Next Steps</h2>
        <ol className="mt-4 space-y-4 text-sm">
          <li>
            <span className="font-semibold text-amber">
              1. {isEventPlanningRequest ? "Event Consultation" : "Chef Consultation"} —
            </span>{" "}
            <span className="text-white/80">
              {isEventPlanningRequest
                ? "Our events team will contact you within 24 hours to review catering needs, timing, and service details."
                : `${booking.chef.name} will contact you within 24 hours to review final dietary restrictions and kitchen needs.`}
            </span>
          </li>
          <li>
            <span className="font-semibold text-amber">2. Host Guide Checklist —</span>{" "}
            <span className="text-white/80">
              Check your email inbox for our Host Guide outlining table prep, trash cleanup,
              and chef coordination guidelines.
            </span>
          </li>
          <li>
            <span className="font-semibold text-amber">3. Relax &amp; Graze —</span>{" "}
            <span className="text-white/80">
              Everything is set! Sit back and enjoy the flawless restaurant-grade fine dining
              in your own home.
            </span>
          </li>
        </ol>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link href="/explore-chefs" className="bg-olive px-6 py-3 text-sm font-semibold text-paper hover:bg-olive/90 transition">
          Browse More Chefs
        </Link>
      </div>
    </div>
  );
}
