import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  getPostsByUser,
  updatePost,
} from "../controllers/post.controller.js";
import { validate } from "../middlewares/validate.js";
import { createPostSchema } from "../validations/post.validation.js";

const router = express.Router();

router.post("/", validate(createPostSchema), authMiddleware, createPost);
router.get("/", getPosts);
router.get("/user/:userId", getPostsByUser);
router.get("/:id", getPostById);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
