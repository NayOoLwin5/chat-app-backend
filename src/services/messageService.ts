import { redisClient, messageQueue } from '../config/redis';
import { decrypt } from '../utils/encryption';

export function sendMessage(senderId: string, content: string, chatRoomId: string, timestamp: string) {
  messageQueue.add('process-message', { senderId, content, chatRoomId, timestamp }, { removeOnComplete: true })
    .then(() => {
      console.log('Message added to queue successfully');
    })
    .catch((error: Error) => {
      console.error('Error adding message to queue:', error);
    });
}

export async function getRecentMessages(chatRoomId: string) {
  const messages = await redisClient.lrange(`chat:${chatRoomId}`, 0, 9);
  return messages.map((msg: string) => {
    const parsedMsg = JSON.parse(msg);
    return parsedMsg;
  });
}