import { prisma } from "../lib/prisma.js";

export const searchTags = async (req, res) => {
  const { search = "" } = req.query;
  const q = search.trim();

  try {
    const tags = await prisma.tag.findMany({
      where: q
        ? { name: { contains: q, mode: "insensitive" } }
        : undefined,
      orderBy: { name: "asc" },
      take: 20,
      select: { id: true, name: true },
    });
    res.json(tags);
  } catch {
    res.status(500).json({ error: "Error searching tags" });
  }
};
