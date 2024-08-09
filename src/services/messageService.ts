import { redisClient, messageQueue } from '../config/redis';
import Message from '../models/Message';
import { encrypt, decrypt } from '../utils/encryption';

export async function sendMessage(senderId: string, receiverId: string, content: string, chatRoomId: string) {
  const encryptedContent = encrypt(content);
  const message = new Message({
    sender: senderId,
    receiver: receiverId,
    content: encryptedContent,
    chatRoom: chatRoomId
  });

  await message.save();

  // Add message to Redis cache
  await redisClient.lpush(`chat:${chatRoomId}`, JSON.stringify(message));
  await redisClient.ltrim(`chat:${chatRoomId}`, 0, 9); // Keep only the latest 10 messages

  // Add message to processing queue
  await messageQueue.add('process-message', { messageId: message._id });

  return message;
}

export async function getRecentMessages(chatRoomId: string) {
  const messages = await redisClient.lrange(`chat:${chatRoomId}`, 0, 9);
  return messages.map((msg: string) => {
    const parsedMsg = JSON.parse(msg);
    parsedMsg.content = decrypt(parsedMsg.content);
    return parsedMsg;
  });
}