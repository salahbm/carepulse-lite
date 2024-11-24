// File: pages/api/telegram/[userId].ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query; // This will get the userId from the dynamic route
  if (req.method === 'POST') {
    const { message } = req.body;
    console.log('Received message:', message);
    console.log('User ID:', userId); // Use the correct userId

    // Handle sending message via Telegram API
    const botToken = process.env.TG_ACCESS_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
    const responseText = `Hi ${message.message.from.first_name}, I received your message!`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
      }),
    });

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
