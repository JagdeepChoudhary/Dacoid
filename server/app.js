import express from 'express';
import connectDB from './db.js';
import authRoutes from './routes/auth.route.js';
import quizRoutes from './routes/quiz.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const allowedOrigins = [
    'http://localhost:5173',
    'https://quizmasterjd.netlify.app',

];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
const app = express();
app.use(cookieParser())
app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
