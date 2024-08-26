import { messageQueue } from '../config/redis';
import { Job } from 'bull';
import Message, { IMessage } from '../models/Message';
import { IUser } from '../models/User';
import ChatRoom, { IChatRoom } from '../models/ChatRoom';
import { encrypt } from '../utils/encryption';
import mongoose from 'mongoose';

messageQueue.process('process-message', async (job: Job): Promise<void> => {
  const { senderId, content, chatRoomId, timestamp } = job.data;
  
  try {
    const chatRoom: IChatRoom | null = await ChatRoom.findById(chatRoomId).populate('participants').lean();
    if (!chatRoom) {
      throw new Error(`ChatRoom not found for id: ${chatRoomId}`);
    }
    const receiverIds: mongoose.Types.ObjectId[]  = chatRoom.participants.map((participant) => participant._id); 

    const encryptedContent: string = encrypt(content);
    const message: IMessage = new Message({
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