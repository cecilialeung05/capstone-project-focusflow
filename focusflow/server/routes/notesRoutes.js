import express from "express";
const router = express.Router();

import { getNotes, getNote, addNote, updateNote, deleteNote } from '../controllers/notesController.js';

// // Notes routes
router.get("/", getNotes); 
router.get("/:id", getNote);
router.post("/", addNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;