import User from '../models/User';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export async function registerUser(email: string, password: string, name: string): Promise<IUser | null> {
  const user: IUser = new User({ email, password, name });
  await user.save();
  return user;
}

export async function loginUser(email: string, password: string): Promise<{ user: IUser | null; token: string }> {
  const user: IUser | null = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return { user, token };
}