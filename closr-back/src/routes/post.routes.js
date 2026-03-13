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

import { likePost, unlikePost } from "../controllers/like.controller.js";

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller.js";

import upload from "../middlewares/upload.js";
import { uploadImage } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", validate(createPostSchema), authMiddleware, createPost);
router.get("/", getPosts);
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/user/:userId", getPostsByUser);
router.get("/:id", getPostById);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

// Likes
router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId/like", authMiddleware, unlikePost);

/* Comments */
router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", authMiddleware, getComments);
router.patch("/:postId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
