import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { redirectByCode } from './controllers/url.controller.js';

const app = express();
app.set('trust proxy', true);

app.use(helmet());
app.use(cors({ origin: '*', credentials: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.get('/:code', redirectByCode);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.MONGODB_URI) {
  console.error('You must set MONGODB_URI in .env (see .env.example)');
  process.exit(1);
}

await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => console.log(`→ Server listening on ${process.env.BASE_URL || 'http://localhost:' + PORT}`));

export default app;
