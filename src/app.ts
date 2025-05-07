import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:8080'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);

export default app;
