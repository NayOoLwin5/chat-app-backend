import { Request, Response } from 'express';
import User from '../models/User';
import { addParticipant } from '../services/chatRoomService';
import { redisClient } from '../config/redis'

// interface CustomRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

export async function addFriendController(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const { friendId, roomId } = req.body;
    
    await addParticipant(roomId, friendId);
    const io = req.app.get('io');
    const friendSocketId = await redisClient.get(`userSocket:${friendId}`);
    if (friendSocketId) {
      io.sockets.sockets.get(friendSocketId)?.join(roomId);
    }
    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
}

export async function getAllUsers(req: any, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    let currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } }, 'name email'); 
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: (error as Error).message });
  }
}