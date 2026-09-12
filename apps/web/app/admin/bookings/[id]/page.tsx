"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EVENT_TYPE_LABELS, type Booking, type BookingStatus } from "@/lib/types";

const statuses: BookingStatus[] = ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"];

interface BookingDetail extends Booking {
  chef: { name: string; slug: string };
}

export default function AdminBookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then(setBooking);
  }, [id]);

  async function updateStatus(status: BookingStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setBooking(await res.json());
    } finally {
      setUpdating(false);
    }
  }

  if (!booking) {
    return <div className="mx-auto max-w-2xl px-6 py-12 text-ink/50">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <button onClick={() => router.back()} className="text-sm text-ink/50 hover:text-rust">
        &larr; Back to dashboard
      </button>

      <h1 className="mt-4 font-display text-3xl text-ink">{booking.name}</h1>
      <p className="text-ink/60">
        {EVENT_TYPE_LABELS[booking.eventType]} with {booking.chef.name}
      </p>

      <dl className="mt-8 space-y-3 border-t border-ink/10 pt-6 text-sm">
        <Row label="Email" value={booking.email} />
        <Row label="Phone" value={booking.phone} />
        <Row label="Event date" value={new Date(booking.eventDate).toLocaleDateString()} />
        <Row label="Guest count" value={String(booking.guestCount)} />
        <Row label="Venue status" value={booking.venueStatus} />
        <Row label="Dietary" value={booking.dietary.join(", ") || "—"} />
        <Row label="Notes" value={booking.notes || "—"} />
        <Row label="Estimated total" value={booking.estimatedTotal ? `$${booking.estimatedTotal.toFixed(2)}` : "—"} />
        <Row label="Submitted" value={new Date(booking.createdAt).toLocaleString()} />
      </dl>

      <div className="mt-8">
        <p className="mb-2 text-sm text-ink/70">Update status</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              disabled={updating}
              onClick={() => updateStatus(s)}
              className={`border px-3 py-1.5 text-xs transition ${
                booking.status === s ? "border-olive bg-olive text-paper" : "border-ink/20 text-ink/70 hover:border-olive"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
