"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Bookings" },
  { href: "/admin/chefs", label: "Chefs" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return null;

  return (
    <div className="border-b border-white/15 bg-[#1c0216]/85 backdrop-blur-md text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <nav className="flex gap-6 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname.startsWith(l.href) ? "text-amber font-semibold" : "text-white/80 hover:text-amber"}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="text-sm font-medium text-white/80 hover:text-amber">
          Log out
        </button>
      </div>
    </div>
  );
}
