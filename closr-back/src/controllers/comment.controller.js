import { prisma } from "../lib/prisma.js";

export const createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { content } = req.body;

    const comment = await prisma.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: {
          content,
          userId,
          postId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });

      return createdComment;
    });

    res.json(comment);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(500).json({ error: "Error creating comment" });
  }
};

// GET comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error loading comments" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.delete({
        where: {
          id: commentId,
        },
      });

      await tx.post.update({
        where: { id: comment.postId },
        data: {
          commentCount: {
            decrement: 1,
          },
        },
      });
    });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
