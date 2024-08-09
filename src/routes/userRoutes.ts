import express from 'express';
import { addFriendController } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/friends', addFriendController);

export default router;