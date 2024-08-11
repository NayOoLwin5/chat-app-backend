import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { sendMessage } from '../services/messageService';
import { redisClient } from '../config/redis';
import { addParticipant, removeParticipant } from '../services/chatRoomService';

export default function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
      if (err) return next(new Error('Authentication error'));
      socket.data.user = decoded;
      next();
    });
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.user.id);

    socket.on('join-room', async (roomId: string) => {
      try {
        const participantId = socket.data.user;
        await addParticipant(roomId, participantId);
        socket.join(roomId);
      } catch (error) {
        socket.emit('error', { message: (error as Error).message });
      }
    });

    socket.on('leave-room', async (roomId: string) => {
      try {
        const participantId = socket.data.user.id;
        await removeParticipant(roomId, participantId);
        socket.leave(roomId);
      } catch (error) {
        socket.emit('error', { message: (error as Error).message });
      }
    });

    socket.on('send-message', async (message: any) => {
      try {
          const { content, roomId } = message;
          const senderId = socket.data.user.id;

          redisClient.lpush(`chat:${roomId}`, JSON.stringify(message))
            .then(() => redisClient.ltrim(`chat:${roomId}`, 0, 9))
            .catch((error) => {
              socket.emit('error', { message: error.message });
            });

          sendMessage(senderId, content, roomId);
          io.to(roomId).emit('new-message', content);

        } catch (error) {
          socket.emit('error', { message: (error as Error).message });
        }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user.id);
    });
  });

  return io;
}