import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const chefs = [
  {
    slug: "marcus-vance",
    name: "Chef Marcus Vance",
    photoUrl: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800",
    cuisineTags: ["Modern French", "Mediterranean"],
    tagline: "Artisanal French cuisine met with coastal Californian freshness.",
    bio: "Formally trained at the Culinary Institute of America and holding Sous Chef posts in three Michelin-starred establishments, Marcus found his true passion in custom intimate event entertaining. His culinary philosophy centers around letting seasonal local harvests sing through classic French saucing techniques.",
    experienceYears: 12,
    eventsCompleted: 340,
    ratingAvg: 4.9,
    reviewCount: 112,
    baseRatePerPerson: 95,
    minGuestCount: 6,
    priceMin: 95,
    priceMax: 150,
    menus: [
      {
        title: "Bespoke Provence Harvest",
        pricePerPerson: 125,
        courses: [
          { course: "Amuse-Bouche", description: "Truffle honey chèvre stuffed fig" },
          { course: "Appetizer", description: "Sea scallops with parsnip silk, beurre noisette" },
          { course: "Entrée", description: "Thyme-crusted roasted duck breast, cherry reduction" },
          { course: "Dessert", description: "Salted lavender caramel tart with cream" },
        ],
      },
      {
        title: "Modern Mediterranean Classic",
        pricePerPerson: 110,
        courses: [
          { course: "Amuse-Bouche", description: "Roasted garlic dip & artisanal focaccia" },
          { course: "Appetizer", description: "Charred heirloom tomato, aged burrata salad" },
          { course: "Entrée", description: "Wild sea bass with saffron artichoke barigoule" },
          { course: "Dessert", description: "Olive oil cake, citrus confit, rosemary honey" },
        ],
      },
    ],
    reviews: [
      {
        guestName: "Clarissa Montgomery",
        eventLabel: "Dinner Party Host · June 2025",
        rating: 5,
        content:
          "Chef Marcus brought an outstanding evening to our home. His attention to detail, explanation of every course, and immaculate kitchen cleanup made the night feel so effortless and ultra luxurious.",
      },
      {
        guestName: "Robert Henderson",
        eventLabel: "Wedding Rehearsal Dinner · Oct 2025",
        rating: 5,
        content:
          "Absolutely stunning execution. The Provence Harvest menu was balanced, beautifully presented, and highly praised by all 24 guests. We cannot recommend Marcus enough.",
      },
    ],
  },
  {
    slug: "elena-rostova",
    name: "Chef Elena Rostova",
    photoUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
    cuisineTags: ["Italian", "Seafood"],
    tagline: "Fresh hand-rolled pasta and coastal Mediterranean seafood banquets.",
    bio: "Specializing in fresh hand rolled pasta and coastal Mediterranean seafood banquets, Elena brings a warm, garden-party sensibility to every table she cooks for.",
    experienceYears: 10,
    eventsCompleted: 280,
    ratingAvg: 5.0,
    reviewCount: 98,
    baseRatePerPerson: 110,
    minGuestCount: 6,
    priceMin: 110,
    priceMax: 180,
    menus: [
      {
        title: "Coastal Seafood Feast",
        pricePerPerson: 140,
        courses: [
          { course: "Antipasto", description: "Marinated olives, burrata, cured meats" },
          { course: "Primo", description: "Hand-rolled tagliatelle, lemon-butter crab" },
          { course: "Secondo", description: "Grilled branzino, salsa verde" },
          { course: "Dolce", description: "Limoncello tiramisu" },
        ],
      },
    ],
    reviews: [],
  },
  {
    slug: "kenji-sato",
    name: "Chef Kenji Sato",
    photoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800",
    cuisineTags: ["Japanese Kaiseki", "Fusion"],
    tagline: "Traditional Japanese aesthetic values with contemporary Western flavors.",
    bio: "Trained in Kyoto, Chef Kenji blends traditional Japanese aesthetic values with contemporary Western flavors, delivering multi-course kaiseki experiences at home.",
    experienceYears: 15,
    eventsCompleted: 410,
    ratingAvg: 4.8,
    reviewCount: 145,
    baseRatePerPerson: 140,
    minGuestCount: 4,
    priceMin: 140,
    priceMax: 220,
    menus: [
      {
        title: "Kyoto Kaiseki Journey",
        pricePerPerson: 180,
        courses: [
          { course: "Sakizuke", description: "Seasonal amuse bite" },
          { course: "Sashimi", description: "Chef's selection, soy pearls" },
          { course: "Yakimono", description: "Charcoal-grilled miso black cod" },
          { course: "Mizumono", description: "Matcha and yuzu dessert" },
        ],
      },
    ],
    reviews: [],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@gathergraze.com" },
    update: {},
    create: { email: "admin@gathergraze.com", passwordHash, name: "Admin" },
  });

  for (const c of chefs) {
    const { menus, reviews, ...chefData } = c;
    const chef = await prisma.chef.upsert({
      where: { slug: c.slug },
      update: { photoUrl: c.photoUrl, active: true },
      create: { ...chefData, active: true },
    });

    for (const m of menus) {
      await prisma.menu.create({ data: { ...m, chefId: chef.id } });
    }
    for (const r of reviews) {
      await prisma.review.create({ data: { ...r, chefId: chef.id } });
    }
  }

  console.log("Seed complete. Admin login: admin@gathergraze.com / changeme123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
