import type { EventType } from "@/lib/types";

export const EVENT_SERVICE_NOTE_PREFIX = "Selected service: ";

export const EVENT_SERVICE_OPTIONS: { label: string; eventType: EventType }[] = [
  { label: "Corporate Lunch Plans", eventType: "CORPORATE" },
  { label: "Town Hall Meeting Lunches", eventType: "CORPORATE" },
  { label: "Board & Executive Dining", eventType: "CORPORATE" },
  { label: "Wedding & Reception Catering", eventType: "WEDDING" },
  { label: "Birthday & Milestone Celebrations", eventType: "BIRTHDAY" },
  { label: "Cocktail & Networking Events", eventType: "OTHER" },
  { label: "Outdoor & Garden Parties", eventType: "OTHER" },
  { label: "Buffet & Food Station Setup", eventType: "OTHER" },
];

export function buildEventServiceNotes(serviceLabel: string, notes: string) {
  return `${EVENT_SERVICE_NOTE_PREFIX}${serviceLabel}${notes ? `\n\n${notes}` : ""}`;
}

export function parseEventServiceNotes(notes?: string | null) {
  if (!notes?.startsWith(EVENT_SERVICE_NOTE_PREFIX)) {
    return { serviceLabel: null, notes: notes || "" };
  }

  const [serviceLine, ...rest] = notes.split("\n");

  return {
    serviceLabel: serviceLine.replace(EVENT_SERVICE_NOTE_PREFIX, ""),
    notes: rest.join("\n").trim(),
  };
}
