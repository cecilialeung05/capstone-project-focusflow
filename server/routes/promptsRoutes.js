import express from "express";
const router = express.Router();

import { getPrompts, createPrompt } from "../controllers/promptsController.js";

router.get("/prompts", getPrompts); 
router.post("/prompts", createPrompt);  
export default router;  