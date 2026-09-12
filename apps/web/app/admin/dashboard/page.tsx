"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EVENT_TYPE_LABELS, type Booking } from "@/lib/types";

const statusColors: Record<string, string> = {
  NEW: "bg-amber/20 text-amber border border-amber/40",
  CONTACTED: "bg-blue-500/20 text-blue-300 border border-blue-500/40",
  CONFIRMED: "bg-purple-500/20 text-purple-300 border border-purple-500/40",
  COMPLETED: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  CANCELLED: "bg-white/10 text-white/50 border border-white/20",
};

interface BookingRow extends Booking {
  chef: { name: string; slug: string };
}

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch(`/api/bookings${filter ? `?status=${filter}` : ""}`)
      .then((res) => res.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-ink/20 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-ink/50">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="mt-8 text-ink/50">No bookings yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-white/15 bg-[#1c0216]/80 rounded-xl backdrop-blur-md shadow-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-white/15 bg-white/5 text-left text-white font-semibold">
              <tr>
                <th className="px-4 py-3 text-white">Guest</th>
                <th className="px-4 py-3 text-white">Chef</th>
                <th className="px-4 py-3 text-white">Event</th>
                <th className="px-4 py-3 text-white">Date</th>
                <th className="px-4 py-3 text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {bookings.map((b) => (
                <tr key={b.id} className="transition hover:bg-white/5">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${b.id}`} className="font-medium text-amber hover:underline">
                      {b.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white">{b.chef.name}</td>
                  <td className="px-4 py-3 text-white/90">{EVENT_TYPE_LABELS[b.eventType]}</td>
                  <td className="px-4 py-3 text-white/80">{new Date(b.eventDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
