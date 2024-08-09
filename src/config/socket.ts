import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { sendMessageToRoom } from '../controllers/chatController';

export default function setupSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
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

  io.on('connection', (socket) => {
    console.log('User connected:', socket.data.user.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
    });

    socket.on('send-message', (message) => {
        try {
            const { content, roomId } = message;
            const senderId = socket.data.user.id;
            const req = {
              body: { content },
              params: { roomId },
              user: { id: senderId }
            };
            const res = {
              status: (statusCode: number) => ({
                json: (data: any) => {
                  if (statusCode === 201) {
                    io.to(roomId).emit('new-message', data);
                  } else {
                    socket.emit('error', data);
                  }
                }
              })
            };
            await sendMessageToRoom(req as any, res as any);
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