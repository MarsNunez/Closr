import { prisma } from "../lib/prisma.js";

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const like = await prisma.$transaction(async (tx) => {
      const createdLike = await tx.like.create({
        data: {
          userId,
          postId,
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return createdLike;
    });

    res.json(like);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Already liked" });
    }

    if (error.code === "P2003") {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(500).json({ error: "Error liking post" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    await prisma.$transaction(async (tx) => {
      await tx.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
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
