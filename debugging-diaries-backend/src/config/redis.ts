import { createClient } from 'redis';
import { EnvConstant } from '@constants/allConstant.js';

const redisClient = createClient({
  url: EnvConstant.REDIS_URL,
  socket: {
    connectTimeout: 5000,
  },
  disableOfflineQueue: true,
});

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected successfully!');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
};

export default redisClient;
