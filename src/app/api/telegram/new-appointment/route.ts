// src/app/api/telegram/new-appointment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // const { userId } = req.url; // Extract userId from the URL
  const { message } = await req.json(); // Parse incoming JSON body

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

  return NextResponse.json({ success: true });
}
