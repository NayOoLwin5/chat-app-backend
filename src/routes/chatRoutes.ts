import express from 'express';
import { createRoom, getRoomMessages, getUserChatRooms } from '../controllers/chatController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/rooms', createRoom);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.get('/rooms', getUserChatRooms);

export default router;