import express from "express";
import { searchTags } from "../controllers/tag.controller.js";

const router = express.Router();

router.get("/", searchTags);

export default router;
