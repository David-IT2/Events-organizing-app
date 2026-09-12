import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = "https://www.gathergraze.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chefs = await prisma.chef.findMany({ where: { active: true }, select: { slug: true } });

  const staticPages = ["", "/explore-chefs"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const chefPages = chefs.map((c) => ({
    url: `${baseUrl}/chefs/${c.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...chefPages];
}
