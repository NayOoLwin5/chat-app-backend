import { Request, Response } from 'express';
import { createChatRoom, getChatRoom } from '../services/chatRoomService';
import { sendMessage, getRecentMessages } from '../services/messageService';

export async function createRoom(req: Request, res: Response) {
  try {
    const { name, participants, isGroupChat } = req.body;
    const chatRoom = await createChatRoom(name, participants, isGroupChat);
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function getRoomMessages(req: Request, res: Response) {
  try {
    const { roomId } = req.params;
    const messages = await getRecentMessages(roomId);
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function sendMessageToRoom(req: Request, res: Response) {
  try {
    const { content } = req.body;
    const { roomId } = req.params;
    const senderId = (req.user as any).id;
    const room = await getChatRoom(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }
    const receiverId = room.participants.find(p => p.toString() !== senderId)?.toString();
    if (!receiverId) {
      return res.status(400).json({ message: 'Invalid receiver' });
    }
    const message = await sendMessage(senderId, receiverId, content, roomId);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}