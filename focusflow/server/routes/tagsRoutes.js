import express from "express";
const router = express.Router();

import { getTags, getTag, addTag, updateTag, deleteTag } from '../controllers/tagsControllers.js';

router.get('/tags', getTags);
router.get('/tags/:id', getTag);
router.post('/tags', addTag);
router.put('/tags/:id', updateTag);
router.delete('/tags/:id', deleteTag);

export default router;