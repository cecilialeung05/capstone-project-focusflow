import express from "express";
const router = express.Router();

import { getTasks, getTask, addTask, updateTask, deleteTask } from '../controllers/tasksController.js';

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
