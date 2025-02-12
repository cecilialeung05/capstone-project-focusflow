import express from "express";
const router = express.Router();

import { getTags, getTag, addTag, updateTag, deleteTag } from '../controllers/tagsController.js';

router.get('/', getTags);
router.get('/:id', getTag);
router.post('/', addTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;