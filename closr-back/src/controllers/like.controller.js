import prisma from "../lib/prisma.js";

export const likePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const like = await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    res.json(like);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Already liked" });
    }

    res.status(500).json({ error: "Error liking post" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.json({ message: "Like removed" });
  } catch (error) {
    res.status(500).json({ error: "Error removing like" });
  }
};
