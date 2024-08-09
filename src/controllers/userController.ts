import { Request, Response } from 'express';
import { addFriend } from '../services/userService';

export async function addFriendController(req: Request, res: Response) {
  try {
    const userId = (req.user as any).id;
    const { friendId } = req.body;
    const updatedUser = await addFriend(userId, friendId);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}