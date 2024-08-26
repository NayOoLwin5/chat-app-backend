import { Request, Response } from 'express';
import User from '../models/User';
import { addParticipant } from '../services/chatRoomService';
import { redisClient } from '../config/redis';
import { IUser } from '../models/User';

interface AddFriendRequest extends Request {
  body: {
    friendId: string;
    roomId: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

export async function addFriendController(req: AddFriendRequest, res: Response): Promise<void> {
  try {
    const { friendId, roomId } = req.body;
    
    await addParticipant(roomId, friendId);
    const io = req.app.get('io');
    const friendSocketId: string | null = await redisClient.get(`userSocket:${friendId}`);
    if (friendSocketId) {
      io.sockets.sockets.get(friendSocketId)?.join(roomId);
    }
    const response: ApiResponse<null> = { status: 'success' };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(400).json(response);
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      const response: ApiResponse<null> = { status: 'error', message: 'Unauthorized' };
      res.status(401).json(response);
      return;
    }
    const currentUserId: string = (req as AuthenticatedRequest).user!.id;
    const users: IUser[] = await User.find({ _id: { $ne: currentUserId } }, 'name email').lean();
    const response: ApiResponse<typeof users> = { status: 'success', data: users };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(500).json(response);
  }
}