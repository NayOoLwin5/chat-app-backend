import Redis from 'ioredis';
import Bull from 'bull';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const redisClient = new Redis(redisUrl);
const messageQueue = new Bull('message-queue', redisUrl);

export { redisClient, messageQueue };