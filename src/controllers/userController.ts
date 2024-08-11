import { Request, Response } from 'express';
import { addFriend } from '../services/userService';

export async function addFriendController(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const { friendId } = req.body;
    const updatedUser = await addFriend(userId, friendId);
    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
}