import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler, notFound } from './utils/errors.js';

dotenv.config();
connectDb();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, methods: ['GET','POST','PUT','PATCH','DELETE'] }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
