import type { Metadata } from "next";
import ExploreChefsClient from "./ExploreChefsClient";

export const metadata: Metadata = {
  title: "Explore Chefs",
  description: "Browse vetted private chefs ready to curate your bespoke menu and cook live in your home.",
};

export default function ExploreChefsPage() {
  return <ExploreChefsClient />;
}
