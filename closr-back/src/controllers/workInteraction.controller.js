import { prisma } from "../lib/prisma.js";

/* ─── LIKES ─────────────────────────────────────────────────────────── */

export const likeWork = async (req, res) => {
  const userId = req.user.userId;
  const { workId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.workLike.create({ data: { userId, workId } });
      await tx.work.update({
        where: { id: workId },
        data: { likeCount: { increment: 1 } },
      });
    });
    res.status(201).json({ message: "Liked" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Already liked" });
    }
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Work not found" });
    }
    res.status(500).json({ error: "Error liking work" });
  }
};

export const unlikeWork = async (req, res) => {
  const userId = req.user.userId;
  const { workId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.workLike.delete({
        where: { userId_workId: { userId, workId } },
      });
      await tx.work.update({
        where: { id: workId },
        data: { likeCount: { decrement: 1 } },
      });
    });
    res.json({ message: "Like removed" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Like not found" });
    }
    res.status(500).json({ error: "Error removing like" });
  }
};

/* ─── SAVES ─────────────────────────────────────────────────────────── */

export const saveWork = async (req, res) => {
  const userId = req.user.userId;
  const { workId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.workSave.create({ data: { userId, workId } });
      await tx.work.update({
        where: { id: workId },
        data: { saveCount: { increment: 1 } },
      });
    });
    res.status(201).json({ message: "Saved" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Already saved" });
    }
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Work not found" });
    }
    res.status(500).json({ error: "Error saving work" });
  }
};

export const unsaveWork = async (req, res) => {
  const userId = req.user.userId;
  const { workId } = req.params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.workSave.delete({
        where: { userId_workId: { userId, workId } },
      });
      await tx.work.update({
        where: { id: workId },
        data: { saveCount: { decrement: 1 } },
      });
    });
    res.json({ message: "Save removed" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Save not found" });
    }
    res.status(500).json({ error: "Error removing save" });
  }
};

/* ─── COMMENTS ───────────────────────────────────────────────────────── */

export const getWorkComments = async (req, res) => {
  const { workId } = req.params;

  try {
    const comments = await prisma.workComment.findMany({
      where: { workId },
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch {
    res.status(500).json({ error: "Error loading comments" });
  }
};

export const createWorkComment = async (req, res) => {
  const userId = req.user.userId;
  const { workId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.$transaction(async (tx) => {
      const created = await tx.workComment.create({
        data: { content, userId, workId },
        include: {
          user: { select: { id: true, username: true } },
        },
      });
      await tx.work.update({
        where: { id: workId },
        data: { commentCount: { increment: 1 } },
      });
      return created;
    });
    res.status(201).json(comment);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Work not found" });
    }
    res.status(500).json({ error: "Error creating comment" });
  }
};

export const deleteWorkComment = async (req, res) => {
  const userId = req.user.userId;
  const { workId, commentId } = req.params;

  try {
    const comment = await prisma.workComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.workComment.delete({ where: { id: commentId } });
      await tx.work.update({
        where: { id: workId },
        data: { commentCount: { decrement: 1 } },
      });
    });

    res.json({ message: "Comment deleted" });
  } catch {
    res.status(500).json({ error: "Error deleting comment" });
  }
};

/* ─── SAVED WORKS (for user profile) ────────────────────────────────── */

export const getSavedWorks = async (req, res) => {
  const { userId } = req.params;

  // Only the owner can see their saved works
  if (req.user.userId !== userId) {
    return res.status(403).json({ error: "Not allowed" });
  }

  try {
    const saves = await prisma.workSave.findMany({
      where: { userId },
      include: {
        work: {
          include: {
            author: { select: { id: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const works = saves.map((s) => s.work);
    res.json(works);
  } catch {
    res.status(500).json({ error: "Error loading saved works" });
  }
};
