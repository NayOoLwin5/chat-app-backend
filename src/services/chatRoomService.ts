import ChatRoom from '../models/ChatRoom';
import mongoose, { Schema } from 'mongoose';

export async function createChatRoom(name: string, participants: string[], isGroupChat: boolean) {
  try {
    const chatRoom = new ChatRoom({
      name,
      participants,
      isGroupChat
    });
    await chatRoom.save();
    return chatRoom;
  } catch (error) {
    throw new Error(`Error creating chat room: ${(error as Error).message}`);
  }
}

export async function getChatRoom(id: string) {
  try {
    return await ChatRoom.findById(id).populate('participants', 'name email');
  } catch (error) {
    throw new Error(`Error getting chat room: ${(error as Error).message}`);
  }
}

export async function addParticipant(chatRoomId: string, participantId: string) {
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }
    const objectIdParticipant = new mongoose.Types.ObjectId(participantId);
    chatRoom.participants.push(objectIdParticipant);
    await chatRoom.save();
    return chatRoom;
  } catch (error) {
    throw new Error(`Error adding participant: ${(error as Error).message}`);
  }
}

export async function removeParticipant(chatRoomId: string, participantId: string) {
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }
    chatRoom.participants = chatRoom.participants.filter(
      (id) => !id.equals(new mongoose.Types.ObjectId(participantId))
    );
    await chatRoom.save();
    return chatRoom;
  } catch (error) {
    throw new Error(`Error removing participant: ${(error as Error).message}`);
  }
}

