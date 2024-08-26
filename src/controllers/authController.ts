import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/userService';
import { IUser } from '../models/User';

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

interface LoginRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

export async function register(req: RegisterRequest, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const user = await registerUser(email, password, name);
    const response: ApiResponse<IUser | null> = { status: 'success', data: user };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(400).json(response);
  }
}

export async function login(req: LoginRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    const response: ApiResponse<{ user: typeof user; token: string }> = { status: 'success', data: { user, token } };
    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = { status: 'error', message: (error as Error).message };
    res.status(401).json(response);
  }
}