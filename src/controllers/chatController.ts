import { Request, Response } from 'express';
import { createChatRoom, getUserChatRooms as getUserChatRoomsService } from '../services/chatRoomService';
import { sendMessage, getRecentMessages } from '../services/messageService';

interface CreateRoomRequest extends Request {
  body: {
    name: string;
    participants: string[];
    isGroupChat: boolean;
  };
}

interface GetRoomMessagesRequest extends Request {
  params: {
    roomId: string;
  };
}

interface GetUserChatRoomsRequest extends Request {
  user: {
    id: string;
  };
}

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

export async function createRoom(req: CreateRoomRequest, res: Response): Promise<void> {
  try {
    const { name, participants, isGroupChat } = req.body;
    const chatRoom = await createChatRoom(name, participants, isGroupChat);
    const response: ApiResponse<typeof chatRoom> = { status: 'success', data: chatRoom };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(400).json(response);
  }
}

export async function getRoomMessages(req: GetRoomMessagesRequest, res: Response): Promise<void> {
  try {
    const { roomId } = req.params;
    const messages = await getRecentMessages(roomId);
    const response: ApiResponse<typeof messages> = { status: 'success', data: messages };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(400).json(response);
  }
}

export async function getUserChatRooms(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'User not authenticated' });
      return;
    }
    const userId = (req.user as GetUserChatRoomsRequest['user']).id;
    const chatRooms = await getUserChatRoomsService(userId);
    const response: ApiResponse<typeof chatRooms> = { status: 'success', data: chatRooms };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(500).json(response);
  }
}