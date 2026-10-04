import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Gather & Graze curates private chef experiences and bespoke event catering.",
};

const values = [
  {
    title: "Chef-Led Planning",
    body: "Every gathering begins with your guests, occasion, and table style, then moves into menu design with a vetted culinary partner.",
  },
  {
    title: "Quietly Polished Service",
    body: "From sourcing to clean-down, the experience is handled with care so hosting feels calm, generous, and deeply personal.",
  },
  {
    title: "Menus With A Sense Of Place",
    body: "We favor seasonal ingredients, elegant presentation, and food that feels tailored to the room rather than pulled from a template.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rust">About Gather &amp; Graze</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-white md:text-5xl">
            Intimate hospitality, shaped around the way you gather.
          </h1>
          <p className="mt-6 max-w-xl text-white/80">
            Gather &amp; Graze connects hosts with private chefs who bring restaurant-level
            food, thoughtful event flow, and warm service into homes, gardens, offices,
            and celebration spaces.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/explore-chefs" className="bg-rust px-6 py-3 text-sm font-semibold text-paper transition hover:bg-rust/90">
              Browse Private Chefs
            </Link>
            <Link href="/event-types" className="border border-white/30 px-6 py-3 text-sm text-white hover:border-white">
              View Event Types
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden border border-white/15 rounded-xl shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200"
            alt="Guests sharing a chef-prepared dinner around a candlelit table"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="border border-white/15 bg-[#1c0216]/80 p-6 text-white backdrop-blur-md shadow-xl rounded-xl">
              <h2 className="font-display text-xl font-semibold">{value.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">{value.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
