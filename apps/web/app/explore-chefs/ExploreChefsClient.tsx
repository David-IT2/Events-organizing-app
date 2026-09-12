"use client";

import { useEffect, useState } from "react";
import ChefCard from "@/components/ChefCard";
import type { ChefSummary } from "@/lib/types";

const CUISINES = ["All Cuisines", "Modern French", "Italian", "Japanese Kaiseki", "Mediterranean", "Seafood"];

export default function ExploreChefsClient() {
  const [chefs, setChefs] = useState<ChefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All Cuisines");

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (cuisine !== "All Cuisines") params.set("cuisine", cuisine);

    setLoading(true);
    fetch(`/api/chefs?${params.toString()}`)
      .then((res) => res.json())
      .then(setChefs)
      .finally(() => setLoading(false));
  }, [query, cuisine]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Meet Our Culinary Artists</h1>
      <p className="mt-2 text-ink/70">
        Browse through vetted local private chefs ready to curate your bespoke menu and
        cook live in your home.
      </p>

      <div className="mt-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by chef name, specialty, or cuisine style..."
          className="flex-1 border border-white/20 bg-white text-slate-900 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              cuisine === c
                ? "bg-[#FFB600] text-[#1c0216] font-semibold shadow-md"
                : "bg-white/10 text-white hover:bg-[#FFB600] hover:text-[#1c0216]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink/60">
        {loading ? "Searching..." : `Showing ${chefs.length} matched private chefs`}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chefs.map((chef) => (
          <ChefCard key={chef.id} chef={chef} />
        ))}
      </div>

      {!loading && chefs.length === 0 && (
        <p className="mt-12 text-center text-ink/50">No chefs match your search yet.</p>
      )}
    </div>
  );
}
