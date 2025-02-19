import express from "express";
const router = express.Router();

import { getNotes, getNote, addNote, updateNote, deleteNote } from '../controllers/notesController.js';
import { body, validationResult } from 'express-validator';

const validateNote = [
    body('task_id').optional().isInt().withMessage('Task ID must be an integer'),
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').isInt().withMessage('Each tag must be an integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.get("/", getNotes); 
router.get("/:id", getNote);
router.post("/", validateNote, addNote);
router.put("/:id", validateNote, updateNote);
router.delete("/:id", deleteNote);

export default router;