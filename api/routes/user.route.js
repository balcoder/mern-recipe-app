import express from 'express';
import { test } from '../controllers/user.controller.js';

// create a router
const router = express.Router();

router.get('/foo', test)

export default router;