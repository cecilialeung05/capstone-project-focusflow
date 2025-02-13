import express from "express";
const router = express.Router();
import { body, validationResult } from 'express-validator';

import { getTags, getTag, addTag, updateTag, deleteTag } from '../controllers/tagsController.js';

const validateTag = [
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name cannot be longer than 255 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

router.get('/', getTags);
router.get('/:id', getTag);
router.post('/', validateTag, addTag);
router.put('/:id', validateTag, updateTag);
router.delete('/:id', deleteTag);

export default router;