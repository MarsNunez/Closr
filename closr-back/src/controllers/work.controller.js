import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";

export const createWork = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "closr/works",
        },
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
        authorId: req.user.userId,
      },
    });

    res.status(201).json(work);
  } catch (error) {
    res.status(500).json({
      error: "Error creating work",
      errordetails: error.message,
    });
  }
};
