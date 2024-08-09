import ChatRoom from '../models/ChatRoom';

export async function createChatRoom(name: string, participants: string[], isGroupChat: boolean) {
  const chatRoom = new ChatRoom({
    name,
    participants,
    isGroupChat
  });
  await chatRoom.save();
  return chatRoom;
}

export async function getChatRoom(id: string) {
  return ChatRoom.findById(id).populate('participants', 'name email');
}