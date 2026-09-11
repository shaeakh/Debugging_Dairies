import dotenv from 'dotenv';

dotenv.config();

const EnvConstant = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  FRONTEND_URL1: process.env.FRONTEND_URL1,
  FRONTEND_URL2: process.env.FRONTEND_URL2,
  FRONTEND_URL_TEST: process.env.FRONTEND_URL_TEST,
  BACKEND_URL: process.env.BACKEND_URL,
  AI_MODEL: process.env.AI_MODEL || 'gemini-2.0-flash',
  AI_URL: process.env.AI_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
};

export default EnvConstant;
