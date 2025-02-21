import express from "express";
import { getTasks, getTask, addTask, updateTask, deleteTask } from '../controllers/tasksController.js';

const router = express.Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", addTask);
router.put("/:id",  updateTask);
router.delete("/:id", deleteTask);

export default router;
