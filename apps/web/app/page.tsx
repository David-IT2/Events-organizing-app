import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ChefCard from "@/components/ChefCard";
import EventTypesSections from "@/components/EventTypesSections";
import type { ChefSummary } from "@/lib/types";


const steps = [
  { n: "01", title: "Choose Your Event", body: "Select from dinner parties, corporate receptions, weddings, or birthdays and outline your vision." },
  { n: "02", title: "Pick Your Chef", body: "Review curated elite culinary artists, preview custom signature menus, and consult your match." },
  { n: "03", title: "Enjoy the Experience", body: "Our chefs handle ingredient shopping, preparation, clean service, and leave your kitchen spotless." },
];

export default async function HomePage() {
  const chefs = await prisma.chef.findMany({ where: { active: true }, orderBy: { ratingAvg: "desc" }, take: 3 });
  const chefSummaries: ChefSummary[] = chefs.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    photoUrl: c.photoUrl,
    cuisineTags: c.cuisineTags as string[],
    tagline: c.tagline,
    ratingAvg: c.ratingAvg,
    reviewCount: c.reviewCount,
    priceMin: c.priceMin,
    priceMax: c.priceMax,
  }));

  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-rust">Warm Hospitality Editorial</p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-ink md:text-6xl">
            Unforgettable Events, Crafted by Top Chefs
          </h1>
          <p className="mt-6 max-w-md text-ink/70">
            Bring high-end culinary craft and flawless event coordination directly to your
            table. We match your taste with elite chefs who curate bespoke menus and handle
            everything.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/book" className="bg-olive px-6 py-3 text-sm text-paper transition hover:bg-olive/90">
              Plan Your Event
            </Link>
            <Link href="/explore-chefs" className="border border-ink/20 px-6 py-3 text-sm text-ink hover:border-olive">
              Browse Chefs
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink/10">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200"
            alt="Long table set for an outdoor dinner event"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-rust">Simple Elegance</p>
        <h2 className="mt-2 font-display text-3xl text-white">How Gather &amp; Graze Works</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          We take the complexity out of high-end event planning. Your perfect dining
          gathering is only three steps away.
        </p>
        <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border border-white/15 bg-[#1c0216]/80 p-6 backdrop-blur-md shadow-xl rounded-xl">
              <p className="font-display text-2xl text-rust font-bold">{s.n}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-white/80">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {chefSummaries.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-rust">Our Culinary Masters</p>
          <h2 className="mt-2 text-center font-display text-3xl text-white">
            Meet Our Featured Chefs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-white/80">
            We vet each chef rigorously for culinary creativity, execution craft, and warm
            guest-first service standards.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {chefSummaries.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </section>
      )}

      <EventTypesSections />
    </div>
  );
}
