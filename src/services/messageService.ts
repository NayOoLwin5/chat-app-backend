import { redisClient, messageQueue } from '../config/redis';
import { decrypt } from '../utils/encryption';

export function sendMessage(senderId: string, content: string, chatRoomId: string) {
  const timestamp = new Date().toISOString();
  messageQueue.add('process-message', { senderId, content, chatRoomId, timestamp })
    .then(() => {
      console.log('Message added to queue successfully');
    })
    .catch((error: any) => {
      console.error('Error adding message to queue:', error);
    });
}

export async function getRecentMessages(chatRoomId: string) {
  const messages = await redisClient.lrange(`chat:${chatRoomId}`, 0, 9);
  return messages.map((msg: string) => {
    const parsedMsg = JSON.parse(msg);
    parsedMsg.content = decrypt(parsedMsg.content);
    return parsedMsg;
  });
}