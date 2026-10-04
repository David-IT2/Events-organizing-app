"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildEventServiceNotes,
  EVENT_SERVICE_OPTIONS,
} from "@/lib/eventServices";

const DIETARY_OPTIONS = ["None", "Gluten-Free", "Vegetarian", "Nut-Free", "Vegan"];

export default function EventBookingForm({ defaultChefId }: { defaultChefId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [serviceLabel, setServiceLabel] = useState(EVENT_SERVICE_OPTIONS[0].label);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(6);
  const [venueStatus, setVenueStatus] = useState("");
  const [dietary, setDietary] = useState<string[]>(["None"]);
  const [notes, setNotes] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const selectedService =
    EVENT_SERVICE_OPTIONS.find((service) => service.label === serviceLabel) ||
    EVENT_SERVICE_OPTIONS[0];

  function toggleDietary(option: string) {
    setDietary((prev) => {
      if (option === "None") return ["None"];
      const next = prev.filter((d) => d !== "None");
      return next.includes(option) ? next.filter((d) => d !== option) : [...next, option];
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chefId: defaultChefId,
          name,
          email,
          phone,
          eventType: selectedService.eventType,
          eventDate,
          guestCount,
          venueStatus,
          dietary,
          notes: buildEventServiceNotes(selectedService.label, notes),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong");
      }

      const booking = await res.json();
      router.push(`/booking-confirmed/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-3">
      <div className="md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-rust">
          Event Booking
        </p>
        <h1 className="mt-2 font-display text-3xl text-white">Plan Your Event</h1>
        <p className="mt-2 max-w-xl text-sm text-white/70">
          Share the basics for your gathering and our events team will follow up to refine
          the catering details.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Event Selection</label>
            <select
              value={serviceLabel}
              onChange={(e) => setServiceLabel(e.target.value)}
              className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
            >
              {EVENT_SERVICE_OPTIONS.map((service) => (
                <option key={service.label} value={service.label}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Preferred Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Guest Count</label>
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Venue / Location</label>
            <input
              value={venueStatus}
              onChange={(e) => setVenueStatus(e.target.value)}
              placeholder="Tell us where the event will be hosted"
              className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm text-white/80">Dietary Requirements</label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleDietary(opt)}
                className={`border px-3 py-1.5 text-xs transition ${
                  dietary.includes(opt)
                    ? "border-olive bg-olive text-paper"
                    : "border-white/20 text-white/70 hover:border-olive"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-white/80">Special Requests / Notes</label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="Phone" value={phone} onChange={setPhone} />
        </div>

        {error && <p className="mt-4 text-sm text-rust">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || !name || !email || !phone || !eventDate || !venueStatus}
          className="mt-8 bg-rust px-6 py-3 text-sm font-semibold text-paper transition hover:bg-rust/90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Booking Request"}
        </button>
      </div>

      <aside className="h-fit border border-white/15 bg-[#1c0216]/80 p-6 text-white shadow-xl backdrop-blur-md rounded-xl">
        <h2 className="font-display text-xl text-white">Event Summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-white/60">Selected Event</dt>
            <dd className="mt-1 font-medium text-white">{selectedService.label}</dd>
          </div>
          <div>
            <dt className="text-white/60">Guests</dt>
            <dd className="mt-1 font-medium text-white">{guestCount}</dd>
          </div>
          <div>
            <dt className="text-white/60">Date</dt>
            <dd className="mt-1 font-medium text-white">{eventDate || "Not selected"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-white/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-white/20 bg-white px-3 py-2 text-slate-900 font-medium"
      />
    </div>
  );
}
