"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EVENT_TYPE_LABELS, type ChefDetail, type EventType } from "@/lib/types";

const TRAVEL_FEE = 75;
const DIETARY_OPTIONS = ["None", "Gluten-Free", "Vegetarian", "Nut-Free", "Vegan"];

export default function BookingWizard({ chef }: { chef: ChefDetail }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [eventType, setEventType] = useState<EventType>("INTIMATE_DINNER");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState(chef.minGuestCount || 6);
  const [venueStatus, setVenueStatus] = useState("Providing my own home kitchen");
  const [dietary, setDietary] = useState<string[]>(["None"]);
  const [notes, setNotes] = useState("");
  const [menuId, setMenuId] = useState(chef.menus[0]?.id || "");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const selectedMenu = chef.menus.find((m) => m.id === menuId) || chef.menus[0];

  const subtotal = useMemo(
    () => (selectedMenu ? selectedMenu.pricePerPerson * guestCount : 0),
    [selectedMenu, guestCount]
  );
  const total = subtotal + TRAVEL_FEE;

  function toggleDietary(option: string) {
    setDietary((prev) => {
      if (option === "None") return ["None"];
      const next = prev.filter((d) => d !== "None");
      return next.includes(option) ? next.filter((d) => d !== option) : [...next, option];
    });
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chefId: chef.id,
          menuId: selectedMenu?.id,
          name,
          email,
          phone,
          eventType,
          eventDate,
          guestCount,
          venueStatus,
          dietary,
          notes: notes || undefined,
          estimatedTotal: total,
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
    <div>
      <div className="mb-10 flex items-center gap-3 text-sm">
        <StepLabel n={1} label="Event Details" active={step === 1} done={step > 1} />
        <div className="h-px flex-1 bg-ink/10" />
        <StepLabel n={2} label="Select Menu" active={step === 2} done={step > 2} />
        <div className="h-px flex-1 bg-ink/10" />
        <StepLabel n={3} label="Review & Confirm" active={step === 3} done={false} />
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl text-ink">Your Event Vision</h2>
              <p className="mt-1 text-sm text-ink/60">
                Share details about your gathering to help {chef.name} customize your
                hospitality options.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-ink/70">Occasion Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full border border-ink/20 bg-paper px-3 py-2"
                  >
                    {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-ink/70">Preferred Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-ink/20 bg-paper px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-ink/70">Guest Count</label>
                  <input
                    type="number"
                    min={chef.minGuestCount}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full border border-ink/20 bg-paper px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-ink/70">Venue Status</label>
                  <input
                    value={venueStatus}
                    onChange={(e) => setVenueStatus(e.target.value)}
                    className="w-full border border-ink/20 bg-paper px-3 py-2"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm text-ink/70">Dietary Requirements</label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleDietary(opt)}
                      className={`border px-3 py-1.5 text-xs transition ${
                        dietary.includes(opt)
                          ? "border-olive bg-olive text-paper"
                          : "border-ink/20 text-ink/70 hover:border-olive"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-1 block text-sm text-ink/70">Special Requests / Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-ink/20 bg-paper px-3 py-2"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!eventDate}
                className="mt-8 bg-olive px-6 py-3 text-sm text-paper transition hover:bg-olive/90 disabled:opacity-50"
              >
                Continue to Menu Selection
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl text-ink">Select a Menu</h2>
              <p className="mt-1 text-sm text-ink/60">
                Choose one of {chef.name}&apos;s signature menus for your event.
              </p>

              <div className="mt-6 space-y-4">
                {chef.menus.map((menu) => (
                  <label
                    key={menu.id}
                    className={`block cursor-pointer border p-5 transition ${
                      menuId === menu.id ? "border-olive bg-olive/5" : "border-ink/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="radio"
                        name="menu"
                        className="sr-only"
                        checked={menuId === menu.id}
                        onChange={() => setMenuId(menu.id)}
                      />
                      <span className="font-display text-lg text-ink">{menu.title}</span>
                      <span className="text-rust">${menu.pricePerPerson} / pp</span>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm text-ink/70">
                      {menu.courses.map((c, i) => (
                        <li key={i}>
                          <span className="font-medium">{c.course}:</span> {c.description}
                        </li>
                      ))}
                    </ul>
                  </label>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="border border-ink/20 px-6 py-3 text-sm text-ink hover:border-olive"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-olive px-6 py-3 text-sm text-paper transition hover:bg-olive/90"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl text-ink">Review &amp; Confirm</h2>
              <p className="mt-1 text-sm text-ink/60">
                Add your contact details so {chef.name} can confirm your booking.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" value={name} onChange={setName} />
                <Field label="Email" value={email} onChange={setEmail} type="email" />
                <Field label="Phone" value={phone} onChange={setPhone} />
              </div>

              {error && <p className="mt-4 text-sm text-rust">{error}</p>}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="border border-ink/20 px-6 py-3 text-sm text-ink hover:border-olive"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting || !name || !email || !phone}
                  className="bg-rust px-6 py-3 text-sm text-paper transition hover:bg-rust/90 disabled:opacity-50"
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit border border-white/15 bg-[#1c0216]/80 p-6 text-white shadow-xl backdrop-blur-md rounded-xl">
          <h3 className="font-display text-lg text-white">Event Summary</h3>
          <div className="mt-4 flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wide text-rust">Selected Chef</p>
              <p className="text-sm font-medium text-white">{chef.name}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/70">
                {guestCount} Guests &times; {selectedMenu?.title || "—"}
              </dt>
              <dd className="text-white font-medium">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">Culinary Service &amp; Prep</dt>
              <dd className="text-white font-medium">Included</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">Travel &amp; Kitchen Clean</dt>
              <dd className="text-white font-medium">${TRAVEL_FEE.toFixed(2)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
            <span className="font-medium text-white">Estimated Total</span>
            <span className="font-display text-lg text-rust">${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepLabel({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
          active || done ? "bg-olive text-paper" : "bg-white/10 text-white/50"
        }`}
      >
        {n}
      </span>
      <span className={active ? "text-white font-medium" : "text-white/50"}>{label}</span>
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
        className="w-full border border-white/20 bg-white text-slate-900 px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-amber"
      />
    </div>
  );
}
