import { prisma } from "../lib/prisma.js";

import cloudinary from "../lib/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const result = await cloudinary.uploader.upload_stream(
      { folder: "closr" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }

        res.json({
          imageUrl: result.secure_url,
        });
      },
    );

    result.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
};

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

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post no encontrado",
      });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo post",
    });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo posts",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post no encontrado",
      });
    }

    /* seguridad: solo el autor puede editar */

    if (post.authorId !== req.user.userId) {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando post",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post no encontrado",
      });
    }

    /* seguridad: solo autor o admin */

    if (post.authorId !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "No autorizado",
      });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({
      message: "Post eliminado",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando post",
    });
  }
};
