import { messageQueue } from '../config/redis';
import Message from '../models/Message';

messageQueue.process('process-message', async (job: any) => {
  const { messageId } = job.data;
  const message = await Message.findById(messageId);
  if (message) {
    // Perform any time-consuming operations here
    console.log(`Processing message: ${messageId}`);
    // For example, you could analyze the message content, update user statistics, etc.
  }
});