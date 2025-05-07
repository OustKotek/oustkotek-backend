import { Document } from 'mongoose';
import { User } from '../models/user.model';

interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'user';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
} 