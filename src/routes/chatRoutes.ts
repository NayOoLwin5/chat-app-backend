import express from 'express';
import { createRoom, getRoomMessages, sendMessageToRoom } from '../controllers/chatController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJWT);

router.post('/rooms', createRoom);
router.get('/rooms/:roomId/messages', getRoomMessages);
router.post('/rooms/:roomId/messages', sendMessageToRoom);

export default router;