import { getChannel } from '@config/rabbitmq.js';
import EnvConstant from '@constants/envConstants.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EnvConstant.EMAIL_USER,
    pass: EnvConstant.EMAIL_PASS,
  },
});

export const consumeEmailQueue = async () => {
  const channel = getChannel();

  if (!channel) {
    // eslint-disable-next-line no-console
    console.error('❌ Worker Error: RabbitMQ channel is not initialized!');

    return;
  }

  // eslint-disable-next-line no-console
  console.log('⏳ Worker is now listening for messages on "email_queue"...');

  channel.consume('email_queue', async (msg) => {
    if (msg !== null) {
      // eslint-disable-next-line no-console
      console.log('📥 Worker: New email job received from queue!');

      const emailData = JSON.parse(msg.content.toString());

      try {
        // eslint-disable-next-line no-console
        console.log(`✉️ Sending email to: ${emailData.to}...`);

        await transporter.sendMail(emailData);

        // eslint-disable-next-line no-console
        console.log(`✅ Email successfully sent to: ${emailData.to}`);

        channel.ack(msg);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`❌ Failed to send email to ${emailData.to}. Error details:`, error);

        // ফেইল করলে Queue তে ফেরত পাঠাবে
        channel.nack(msg, false, true);
      }
    }
  });
};
