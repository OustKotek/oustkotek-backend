import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists." });

    const user = new User({
      username,
      email,
      password,
      role: role || 'user',
    })

    await user.save();

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }) as any;
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  }).json({ user });
};

export const logout = (req: Request, res: Response): Response => {
  return res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true
  }).json({ message: 'Logged out' });
};

export const getMe = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Access user from req.user which is set in the isAuthenticated middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Use _id property to find the user
    const user = await User.findById((req.user as any)._id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ message: "Error fetching user", error });
  }
};
