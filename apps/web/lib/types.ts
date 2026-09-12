export type EventType = "INTIMATE_DINNER" | "WEDDING" | "CORPORATE" | "BIRTHDAY" | "OTHER";
export type BookingStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  INTIMATE_DINNER: "Intimate Dinner Party",
  WEDDING: "Bespoke Wedding",
  CORPORATE: "Corporate Entertaining",
  BIRTHDAY: "Milestone Birthday",
  OTHER: "Other",
};

export interface MenuCourse {
  course: string;
  description: string;
}

export interface MenuItem {
  id: string;
  title: string;
  pricePerPerson: number;
  courses: MenuCourse[];
}

export interface ReviewItem {
  id: string;
  guestName: string;
  eventLabel: string;
  rating: number;
  content: string;
}

export interface ChefSummary {
  id: string;
  slug: string;
  name: string;
  photoUrl: string;
  cuisineTags: string[];
  tagline: string;
  ratingAvg: number;
  reviewCount: number;
  priceMin: number;
  priceMax: number;
}

export interface ChefDetail extends ChefSummary {
  bio: string;
  experienceYears: number;
  eventsCompleted: number;
  baseRatePerPerson: number;
  minGuestCount: number;
  menus: MenuItem[];
  gallery: { id: string; url: string; caption?: string | null }[];
  reviews: ReviewItem[];
}

export interface BookingInput {
  chefId: string;
  menuId?: string;
  name: string;
  email: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  guestCount: number;
  venueStatus: string;
  dietary: string[];
  notes?: string;
  estimatedTotal?: number;
}

export interface Booking extends BookingInput {
  id: string;
  status: BookingStatus;
  createdAt: string;
}
