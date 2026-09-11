import redisClient from '@config/redis.js';

export const clearCachePattern = async (pattern: string): Promise<void> => {
  try {
    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      await redisClient.del(key);
    }
  } catch (error) {
    console.error(`❌ Redis Cache Clear Error for pattern [${pattern}]:`, error);
  }
};
