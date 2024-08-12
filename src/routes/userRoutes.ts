import express from 'express';
import { addFriendController, getAllUsers } from '../controllers/userController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/addFriend', addFriendController);
router.get('/all', getAllUsers);

export default router;