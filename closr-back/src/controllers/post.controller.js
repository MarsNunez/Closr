import { prisma } from "../lib/prisma.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await prisma.post.create({
      data: {
        content,
        authorId: req.user.userId,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error creando post",
    });
  }
};
