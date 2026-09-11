import type { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.js';

export const cacheMiddleware = (keyPrefix: string, ttlSeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      // 1. Try to get data from cache
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        res.status(200).json(JSON.parse(cachedData));

        return;
      }

      // 2. Intercept the response to save it to Redis
      const originalJson = res.json.bind(res);

      // Override res.json
      res.json = ((body: any) => {
        // Save to Redis asynchronously with an expiration (TTL)
        redisClient.setEx(key, ttlSeconds, JSON.stringify(body)).catch((err) => {
          console.error('Redis Set Error:', err);
        });

        // Send the actual response to the user
        return originalJson(body);
      }) as any;

      next();
    } catch (error) {
      console.error('Redis Cache Middleware Error:', error);
      next(); // Fail gracefully: if Redis is broken, just query the DB
    }
  };
};
