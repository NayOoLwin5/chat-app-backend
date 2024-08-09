import Redis from 'ioredis';
import Bull from 'bull';

const redisClient = new Redis(process.env.REDIS_URL || '');
const messageQueue = new Bull('message-queue', process.env.REDIS_URL || '');

export { redisClient, messageQueue };