"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  buildEventServiceNotes,
  EVENT_SERVICE_OPTIONS,
} from "@/lib/eventServices";

const DIETARY_OPTIONS = ["None", "Gluten-Free", "Vegetarian", "Nut-Free", "Vegan"];
const PHONE_PREFIX = "+254";
const INPUT_CLASS =
  "w-full border border-white/20 bg-white px-3 py-2 text-base font-normal text-slate-900 placeholder:text-slate-400 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/40";
const CONTACT_INPUT_CLASS =
  "h-12 w-full rounded-md border border-transparent bg-slate-100 px-4 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-amber focus:outline-none focus:ring-2 focus:ring-amber/30";
const CONTACT_LABEL_CLASS = "mb-2 block text-sm font-medium text-white/85";

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

  function getFullName() {
    return `${firstName.trim()} ${lastName.trim()}`.trim();
  }

  function getPhoneValue() {
    const trimmed = phoneNumber.trim();
    if (trimmed.startsWith("+")) return trimmed;

    const localNumber = trimmed.replace(/^\+?254/, "").replace(/^0+/, "");
    return `${PHONE_PREFIX}${localNumber}`;
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
          name: getFullName(),
          email,
          phone: getPhoneValue(),
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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white/80">Guest Count</label>
            <input
              type="number"
              min={1}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className={INPUT_CLASS}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-white/80">Venue / Location</label>
            <input
              value={venueStatus}
              onChange={(e) => setVenueStatus(e.target.value)}
              placeholder="Tell us where the event will be hosted"
              className={INPUT_CLASS}
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
            className={INPUT_CLASS}
          />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field
            label="First Name (required)"
            value={firstName}
            onChange={setFirstName}
            placeholder="Enter your first name"
          />
          <Field
            label="Last Name (required)"
            value={lastName}
            onChange={setLastName}
            placeholder="Enter your last name"
          />
          <Field
            label="Email (required)"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="Enter your email address"
          />
          <div>
            <label className={CONTACT_LABEL_CLASS}>Phone Number (required)</label>
            <div className="flex h-12 overflow-hidden rounded-md bg-slate-100">
              <select
                aria-label="Country code"
                value={PHONE_PREFIX}
                onChange={() => undefined}
                className="w-36 border-r border-slate-200 bg-slate-100 px-3 text-sm font-normal text-slate-900 focus:outline-none"
              >
                <option value={PHONE_PREFIX}>🇰🇪 KE (+254)</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="min-w-0 flex-1 bg-slate-100 px-4 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-rust">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={
            submitting ||
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !eventDate ||
            !venueStatus
          }
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={CONTACT_LABEL_CLASS}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={CONTACT_INPUT_CLASS}
      />
    </div>
  );
}
