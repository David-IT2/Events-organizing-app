export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#1c0216]/90 text-white backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-xl text-white font-semibold">Gather &amp; Graze</p>
          <p className="mt-3 text-sm text-white/70">
            Artisanal private chefs, bespoke event organization, and flawless culinary
            production. We bring the restaurant fine-dining experience directly to your
            home.
          </p>
        </div>
        <FooterCol
          title="Services"
          items={["Private Chef Hire", "Wedding Catering", "Corporate Events", "Dinner Parties"]}
        />
        <FooterCol
          title="Our Chefs"
          items={["Browse Chefs", "Cuisines", "How It Works", "Standards"]}
        />
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Contact Us</p>
          <p className="text-sm text-white/70">hello@gathergraze.com</p>
          <p className="text-sm text-white/70">+1 (555) 321-4567</p>
          <p className="text-sm text-white/70">New York &amp; Hamptons</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} Gather &amp; Graze Inc. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-white">{title}</p>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((i) => (
          <li key={i} className="cursor-pointer transition hover:text-amber">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
