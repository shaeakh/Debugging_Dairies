import amqp from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';
import { EnvConstant } from '@constants/allConstant.js';

let connection: ChannelModel;
let channel: Channel;

export const connectRabbitMQ = async () => {
  let retries = 5; // সর্বোচ্চ ৫ বার চেষ্টা করবে

  while (retries > 0) {
    try {
      const RABBITMQ_URL = EnvConstant.RABBITMQ_URL;

      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertQueue('email_queue', { durable: true });

      // eslint-disable-next-line no-console
      console.log('✅ RabbitMQ connected and queue asserted!');
      break; // সফল হলে লুপ থেকে বের হয়ে যাবে
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      retries -= 1;
      // eslint-disable-next-line no-console
      console.error(
        `⚠️ RabbitMQ connection failed. Retrying in 5 seconds... (Retries left: ${retries})`,
      );

      if (retries === 0) {
        // ৫ বার ফেইল করলে একেবারে এরর থ্রো করবে, যাতে অ্যাপ রিস্টার্ট নেয়
        throw new Error('❌ Could not connect to RabbitMQ after 5 retries');
      }

      // ৫ সেকেন্ড অপেক্ষা (Delay) করবে
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Queue-তে ডেটা পাঠানোর হেল্পার ফাংশন (Producer)
export const sendToQueue = async (queue: string, data: unknown) => {
  if (!channel) {
    // eslint-disable-next-line no-console
    console.error('RabbitMQ channel is not initialized');

    return;
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
};

export const getChannel = () => channel;
