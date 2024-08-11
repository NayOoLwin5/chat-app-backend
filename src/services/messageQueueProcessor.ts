import { messageQueue } from '../config/redis';
import Message from '../models/Message';
import ChatRoom from '../models/ChatRoom';
import { encrypt } from '../utils/encryption';

messageQueue.process('process-message', async (job: any) => {
  const { senderId, content, chatRoomId, timestamp } = job.data;

  try {
    const chatRoom = await ChatRoom.findById(chatRoomId).populate('participants');
    if (!chatRoom) {
      throw new Error(`ChatRoom not found for id: ${chatRoomId}`);
    }
    const receiverIds = chatRoom.participants.map((participant: any) => participant._id); 

    const encryptedContent = encrypt(content);
    const message = new Message({
      sender: senderId,
      receiver: receiverIds,
      content: encryptedContent,
      chatRoom: chatRoomId,
      createdAt: new Date(timestamp)
    });

    await message.save();

    console.log(`Processed and saved message: ${message._id}`);

  } catch (error) {
    console.error('Error processing message:', error);
  }
});