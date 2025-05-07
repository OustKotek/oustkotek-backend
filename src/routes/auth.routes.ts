import express, { RequestHandler } from 'express';
import { getMe, login, logout, register } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();
router.post("/register", register as any);
router.post('/login', login as any);
router.post('/logout', logout as any);
router.get('/user',isAuthenticated, getMe as any)

export default router;
