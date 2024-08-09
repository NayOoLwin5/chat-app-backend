import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/userService';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
}