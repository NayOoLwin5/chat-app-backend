import User from '../models/User';
import jwt from 'jsonwebtoken';

export async function registerUser(email: string, password: string, name: string) {
  const user = new User({ email, password, name });
  await user.save();
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return { user, token };
}