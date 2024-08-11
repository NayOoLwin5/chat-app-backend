import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/userService';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(201).json({ status: 'success', data: { user, token } });
  } catch (error) {
    res.status(401).json({ status: 'error', message: (error as Error).message });
  }
}