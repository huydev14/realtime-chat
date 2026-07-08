import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { protectedRoute } from './middlewares/authMiddleware.js';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';

import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());

// public routes
app.use('/api/auth', authRoute);

// private routes
app.use(protectedRoute);
app.use('/api/users', userRoute);
app.use('/api/friends', friendRoute);
app.use('/api/messages', messageRoute)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
