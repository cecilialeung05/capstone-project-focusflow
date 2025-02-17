import express from "express";
const router = express.Router();
import { body, validationResult } from 'express-validator';
import { getTasks, getTask, addTask, updateTask, deleteTask } from '../controllers/tasksController.js';


const validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('status').optional().isIn(['open', 'in progress', 'completed']).withMessage('Status must be one of: open, in progress, completed'),
    body('dueDate').optional().isISO8601().toDate().withMessage('Due date must be a valid date'),
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

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", validateTask, addTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

export default router;
