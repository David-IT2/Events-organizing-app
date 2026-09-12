"use client";

import { useEffect, useState } from "react";
import type { ChefSummary } from "@/lib/types";

interface AdminChef extends ChefSummary {
  active: boolean;
}

export default function AdminChefsPage() {
  const [chefs, setChefs] = useState<AdminChef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin needs to see inactive chefs too; the public /api/chefs only returns active ones,
    // so in a real build this would hit a dedicated admin-scoped endpoint returning all chefs.
    fetch("/api/chefs")
      .then((res) => res.json())
      .then((data) => setChefs(data.map((c: ChefSummary) => ({ ...c, active: true }))))
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/chefs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    setChefs((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Chefs</h1>
      <p className="mt-1 text-sm text-ink/60">
        Toggle visibility on the public site. Full profile editing (bio, menus, gallery) is
        best managed directly via Prisma Studio for now — see the README.
      </p>

      {loading ? (
        <p className="mt-8 text-ink/50">Loading...</p>
      ) : (
        <div className="mt-8 divide-y divide-white/10 border border-white/15 bg-[#1c0216]/80 text-white backdrop-blur-md shadow-xl rounded-xl">
          {chefs.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-xs text-white/70">{c.cuisineTags.join(", ")}</p>
              </div>
              <button
                onClick={() => toggleActive(c.id, !c.active)}
                className={`border px-3 py-1.5 text-xs font-semibold rounded transition ${
                  c.active ? "border-amber bg-amber text-[#1c0216]" : "border-white/20 text-white/70 hover:border-white"
                }`}
              >
                {c.active ? "Active" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
