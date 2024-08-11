import { Request, Response } from 'express';
import { createChatRoom, getChatRoom } from '../services/chatRoomService';
import { sendMessage, getRecentMessages } from '../services/messageService';

export async function createRoom(req: Request, res: Response) {
  try {
    const { name, participants, isGroupChat } = req.body;
    const chatRoom = await createChatRoom(name, participants, isGroupChat);
    res.status(200).json({ status: 'success', data: chatRoom });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
}

export async function getRoomMessages(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const messages = await getRecentMessages(roomId);
    res.status(200).json({ status: 'success', data: messages });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
}