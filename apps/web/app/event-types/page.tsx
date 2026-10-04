import type { Metadata } from "next";
import EventTypesSections from "@/components/EventTypesSections";

export const metadata: Metadata = {
  title: "Event Types",
  description: "Explore private chef experiences for dinner parties, weddings, corporate entertaining, and milestone celebrations.",
};

export default function EventTypesPage() {
  return <EventTypesSections />;
}
