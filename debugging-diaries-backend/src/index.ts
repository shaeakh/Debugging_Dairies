/* eslint-disable no-console */
import prisma from '@config/db.js';
import { serverConstants } from '@constants/allConstant.js';
import { errorHandler } from '@middlewares/errorHandler.js';
import { globalLimiter } from '@middlewares/rateLimiter.js';
import AuthRoute from '@routes/authRoute.js';
import CategoryRoute from '@routes/categoryRoute.js';
import ProfileRoute from '@routes/profileRoute.js';
import SearchRoute from '@routes/searchRoute.js';
import StoryRoute from '@routes/storyRoute.js';
import UserRoute from '@routes/userRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api-doc/swagger.js';
import EnvConstant from './constants/envConstants.js';
import { connectRedis } from './config/redis.js';
import { connectRabbitMQ } from '@config/rabbitmq.js';
import { consumeEmailQueue } from './workers/emailWorker.js';
import VoteRoute from '@routes/voteRoute.js';
import CommentRoute from '@routes/commentRoute.js';

const app = express();
const server = http.createServer(app);
// const allowedOrigins = [
//   EnvConstant.FRONTEND_URL1,
//   EnvConstant.FRONTEND_URL2,
//   EnvConstant.FRONTEND_URL_TEST,
// ].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ msg: serverConstants.ApiWelcomeMessage });
});

app.use(globalLimiter);
app.use(cookieParser());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  }),
);

// const Llog = (req: Request, res: Response, next: NextFunction) => {
//   console.log(
//     `\n[${new Date().toISOString()}] 🚀 ${req.method} request has been arrive: ${req.originalUrl}`,
//   );

//   if (req.body && Object.keys(req.body).length > 0) {
//     console.log('📦 Request Body:', req.body);
//   }

//   const originalSend = res.send;

//   res.send = function (body) {
//     try {
//       const parsedBody = JSON.parse(body);

//       console.log('📤 Response Body:', parsedBody);
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (e) {
//       console.log('📤 Response Body:', body);
//     }

//     return originalSend.call(this, body);
//   };

//   res.on('finish', () => {
//     console.log(`✅ Response has been sent: Status ${res.statusCode}`);
//   });

//   next();
// };

app.use('/api/users', UserRoute);
app.use('/api/stories', StoryRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/search', SearchRoute);
app.use('/api/categories', CategoryRoute);
app.use('/api/profile', ProfileRoute);
app.use('/api/votes', VoteRoute);
app.use('/api/comments', CommentRoute);
app.use(errorHandler);

const PORT = EnvConstant.PORT;

server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('Database connected Successfully');
    await connectRedis();
    await connectRabbitMQ();
    await consumeEmailQueue();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
  console.log(serverConstants.StartingMessage);
});
export default app;
