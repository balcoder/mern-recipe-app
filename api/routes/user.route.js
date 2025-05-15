import express from 'express';
import { test } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

// create a router
const router = express.Router();

router.get('/foo', test);
router.post('/update/:id', verifyToken, updateUser);

export default router;