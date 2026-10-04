import Image from "next/image";
import Link from "next/link";

const eventTypes = [
  { title: "Intimate Dinner Parties", body: "Fine dining custom menus for 2 to 20 guests.", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800" },
  { title: "Bespoke Weddings", body: "Earthy luxe reception banquets and canapés.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" },
  { title: "Corporate Entertaining", body: "Impress clients with dynamic culinary showmanship.", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800" },
  { title: "Milestone Birthdays", body: "Memorable celebration experiences and cocktails.", img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800" },
];

export default function EventTypesSections() {
  return (
    <>
      <section id="event-types" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-rust">Occasions Designed For You</p>
        <h2 className="mt-2 text-center font-display text-3xl text-white">Popular Event Types</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {eventTypes.map((e) => (
            <div key={e.title} className="overflow-hidden border border-white/15 bg-[#1c0216]/80 backdrop-blur-md shadow-xl rounded-xl">
              <div className="relative aspect-[16/9]">
                <Image src={e.img} alt={e.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-white">{e.title}</h3>
                <p className="mt-1 text-sm text-white/80">{e.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#1c0216]/90 py-20 text-center text-white backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl text-white">Ready to design your bespoke dining gathering?</h2>
          <p className="mt-4 text-white/80">
            Start planning your event by defining your guests, event type, and culinary
            preferences today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/explore-chefs" className="bg-rust px-6 py-3 text-sm text-paper font-semibold transition hover:bg-rust/90">
              Plan Your Event
            </Link>
            <Link href="/explore-chefs" className="border border-white/30 px-6 py-3 text-sm text-white hover:border-white">
              Browse Private Chefs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
