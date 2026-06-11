import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const createWork = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "closr/works" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    const result = await uploadPromise;

    const work = await prisma.work.create({
      data: {
        title,
        description,
        imageUrl: result.secure_url,
        imageWidth: result.width ?? null,
        imageHeight: result.height ?? null,
        authorId: req.user.userId,
      },
    });

    res.status(201).json(work);
  } catch (error) {
    res.status(500).json({ error: "Error creating work", detail: error.message });
  }
};

function withInteractions(work, userId) {
  return {
    ...work,
    likedByMe: userId
      ? work.workLikes?.some((l) => l.userId === userId) ?? false
      : false,
    savedByMe: userId
      ? work.workSaves?.some((s) => s.userId === userId) ?? false
      : false,
  };
}

const workInclude = (userId) => ({
  author: { select: { id: true, username: true } },
  ...(userId
    ? {
        workLikes: { where: { userId }, select: { userId: true } },
        workSaves: { where: { userId }, select: { userId: true } },
      }
    : {}),
});

export const getWorks = async (req, res) => {
  const userId = req.user?.userId ?? null;
  try {
    const works = await prisma.work.findMany({
      include: workInclude(userId),
      orderBy: { createdAt: "desc" },
    });
    res.json(works.map((w) => withInteractions(w, userId)));
  } catch {
    res.status(500).json({ error: "Error getting works" });
  }
};

export const getWorkById = async (req, res) => {
  const { workId } = req.params;
  const userId = req.user?.userId ?? null;
  try {
    const work = await prisma.work.findUnique({
      where: { id: workId },
      include: workInclude(userId),
    });

    if (!work) return res.status(404).json({ error: "Work not found" });

    res.json(withInteractions(work, userId));
  } catch {
    res.status(500).json({ error: "Error getting work" });
  }
};

export const getWorksByUser = async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user?.userId ?? null;
  try {
    const works = await prisma.work.findMany({
      where: { authorId: userId },
      include: workInclude(requesterId),
      orderBy: { createdAt: "desc" },
    });
    res.json(works.map((w) => withInteractions(w, requesterId)));
  } catch {
    res.status(500).json({ error: "Error getting user works" });
  }
};
