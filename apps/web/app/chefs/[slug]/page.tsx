import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ChefDetail } from "@/lib/types";

async function getChef(slug: string) {
  const chef = await prisma.chef.findUnique({
    where: { slug },
    include: { menus: true, gallery: true, reviews: { orderBy: { createdAt: "desc" } } },
  });
  if (!chef || !chef.active) return null;

  return {
    ...chef,
    cuisineTags: chef.cuisineTags as string[],
    menus: chef.menus.map((m) => ({ ...m, courses: m.courses as any })),
  } as unknown as ChefDetail & { id: string };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const chef = await getChef(params.slug);
  if (!chef) return {};
  return {
    title: chef.name,
    description: chef.tagline,
    alternates: { canonical: `/chefs/${params.slug}` },
  };
}

export default async function ChefProfilePage({ params }: { params: { slug: string } }) {
  const chef = await getChef(params.slug);
  if (!chef) return notFound();

  return (
    <div>
      <div className="grid gap-0 border-b border-ink/10 md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Image src={chef.photoUrl} alt={chef.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center bg-ink px-8 py-12 text-paper">
          <div className="flex flex-wrap gap-2">
            {chef.cuisineTags.map((tag) => (
              <span key={tag} className="border border-paper/30 px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl">{chef.name}</h1>
          <p className="mt-2 italic text-paper/70">&ldquo;{chef.tagline}&rdquo;</p>
          <p className="mt-4 text-sm text-paper/70">
            &#9733; {chef.ratingAvg.toFixed(1)} ({chef.reviewCount} Reviews) &nbsp;|&nbsp;
            Experience: {chef.experienceYears} Years &nbsp;|&nbsp; Events Completed: {chef.eventsCompleted}+
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl text-white">About {chef.name.replace("Chef ", "")}</h2>
          <p className="mt-3 text-white/80">{chef.bio}</p>

          <h2 className="mt-12 font-display text-2xl text-white">Signature Menus</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {chef.menus.map((menu) => (
              <div key={menu.id} className="border border-white/15 bg-[#1c0216]/80 p-5 rounded-xl backdrop-blur-md shadow-xl">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-white">{menu.title}</h3>
                  <span className="text-rust font-semibold">${menu.pricePerPerson} / pp</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-white/80">
                  {menu.courses.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium text-white">{c.course}:</span> {c.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {chef.gallery.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-2xl text-white">Past Event Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {chef.gallery.map((img) => (
                  <div key={img.id} className="relative aspect-square border border-white/15 overflow-hidden rounded-lg">
                    <Image src={img.url} alt={img.caption || ""} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}

          {chef.reviews.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-2xl text-white">Guest Reviews</h2>
              <div className="mt-4 space-y-4">
                {chef.reviews.map((r) => (
                  <div key={r.id} className="border border-white/15 bg-[#1c0216]/80 p-5 rounded-xl backdrop-blur-md shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{r.guestName}</p>
                        <p className="text-xs text-white/50">{r.eventLabel}</p>
                      </div>
                      <span className="text-rust">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/80">&ldquo;{r.content}&rdquo;</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="h-fit border border-white/15 bg-[#1c0216]/80 p-6 rounded-xl backdrop-blur-md shadow-xl text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-rust">Booking Details</p>
          <h3 className="mt-1 font-display text-xl text-white">Book {chef.name}</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-white/70">Base Rate</dt>
              <dd className="text-white font-medium">${chef.baseRatePerPerson} / person</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-white/70">Min. Guest Count</dt>
              <dd className="text-white font-medium">{chef.minGuestCount} guests</dd>
            </div>
          </dl>
          <Link
            href={`/book/${chef.id}`}
            className="mt-6 block bg-olive px-4 py-3 text-center text-sm font-semibold text-paper transition hover:bg-olive/90"
          >
            Request to Book Chef
          </Link>
        </aside>
      </div>
    </div>
  );
}
