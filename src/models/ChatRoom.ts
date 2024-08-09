import mongoose, { Document, Schema } from 'mongoose';

interface IChatRoom extends Document {
  name: string;
  participants: mongoose.Types.ObjectId[];
  isGroupChat: boolean;
}

const chatRoomSchema = new Schema<IChatRoom>({
  name: { type: String, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isGroupChat: { type: Boolean, default: false }
});

export default mongoose.model<IChatRoom>('ChatRoom', chatRoomSchema);