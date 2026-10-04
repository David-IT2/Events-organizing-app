"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const cateringServices = [
  { label: "Corporate Lunch Plans", href: "/#catering-corporate" },
  { label: "Town Hall Meeting Lunches", href: "/#catering-townhall" },
  { label: "Board & Executive Dining", href: "/#catering-executive" },
  { label: "Wedding & Reception Catering", href: "/#catering-wedding" },
  { label: "Birthday & Milestone Celebrations", href: "/#catering-birthday" },
  { label: "Cocktail & Networking Events", href: "/#catering-cocktail" },
  { label: "Outdoor & Garden Parties", href: "/#catering-outdoor" },
  { label: "Buffet & Food Station Setup", href: "/#catering-buffet" },
];

export default function Header() {
  const [cateringOpen, setCateringOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCateringOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 border-b border-white/15 bg-[#1c0216]/85 backdrop-blur-md text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-white">
          <span className="flex h-7 w-7 items-center justify-center bg-[#FFB600] font-bold text-sm text-[#1c0216] rounded-full">
            G
          </span>
          Gather &amp; Graze
        </Link>

        <nav className="hidden gap-2 text-sm font-medium md:flex items-center">
          <Link
            href="/explore-chefs"
            className="rounded-full px-4 py-1.5 text-white/90 transition-all duration-200 hover:bg-[#FFB600] hover:text-[#1c0216]"
          >
            Explore Chefs
          </Link>
          <Link
            href="/event-types"
            className="rounded-full px-4 py-1.5 text-white/90 transition-all duration-200 hover:bg-[#FFB600] hover:text-[#1c0216]"
          >
            Event Types
          </Link>

          {/* Catering Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCateringOpen((o) => !o)}
              className="flex items-center gap-1 rounded-full px-4 py-1.5 text-white/90 transition-all duration-200 hover:bg-[#FFB600] hover:text-[#1c0216]"
            >
              Catering Services
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${cateringOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {cateringOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-white/15 bg-[#1c0216]/95 backdrop-blur-md shadow-2xl z-50 overflow-hidden">
                <div className="py-2">
                  {cateringServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setCateringOpen(false)}
                      className="block px-5 py-2.5 text-sm text-white/80 transition-all duration-150 hover:bg-[#FFB600] hover:text-[#1c0216] hover:pl-6"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="rounded-full px-4 py-1.5 text-white/90 transition-all duration-200 hover:bg-[#FFB600] hover:text-[#1c0216]"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/book"
            className="rounded-full bg-[#FFB600] px-5 py-2 text-[#1c0216] font-semibold transition hover:bg-[#FFB600]/90 shadow-md"
          >
            Plan Your Event
          </Link>
        </div>
      </div>
    </header>
  );
}
