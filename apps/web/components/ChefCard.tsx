import Image from "next/image";
import Link from "next/link";
import type { ChefSummary } from "@/lib/types";

export default function ChefCard({ chef }: { chef: ChefSummary }) {
  return (
    <div className="overflow-hidden border border-white/15 bg-[#1c0216]/80 text-white shadow-xl backdrop-blur-md">
      <div className="relative aspect-[4/3]">
        <Image src={chef.photoUrl} alt={chef.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-rust">
          {chef.cuisineTags.join(" / ")}
        </p>
        <h3 className="mt-1 font-display text-xl text-white">{chef.name}</h3>
        <p className="mt-1 text-sm text-white/80">
          &#9733; {chef.ratingAvg.toFixed(1)} ({chef.reviewCount}) &middot; Est. $
          {chef.priceMin}&ndash;${chef.priceMax} / person
        </p>
        <p className="mt-3 text-sm text-white/70">{chef.tagline}</p>
        <Link
          href={`/chefs/${chef.slug}`}
          className="mt-4 block bg-olive px-4 py-2 text-center text-sm font-semibold text-paper transition hover:bg-olive/90"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
