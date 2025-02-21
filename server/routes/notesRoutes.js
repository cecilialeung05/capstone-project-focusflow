import express from "express";
import { getNotes, getNote, addNote, updateNote, deleteNote } from '../controllers/notesController.js';

const router = express.Router();

router.get("/", getNotes); 
router.get("/:id", getNote); 
router.post("/", addNote); 
router.put("/:id", updateNote); 
router.delete("/:id", deleteNote);

export default router;