import express from "express";
import { getTags, getTagById, addTag, updateTag, deleteTag } from '../controllers/tagsController.js';

const router = express.Router();

router.get("/", getTags);
router.get("/:id", getTagById);
router.post("/", addTag);
router.put("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;