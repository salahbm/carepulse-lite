// src/app/api/telegram/new-appointment/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Types
interface TelegramResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Error handling
class TelegramError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'TelegramError';
  }
}

async function sendTelegramMessage(chatId: string, message: string, botToken: string): Promise<void> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // Enable HTML formatting
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new TelegramError(`Telegram API error: ${error.description}`, response.status);
    }
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw new TelegramError(
      error instanceof TelegramError ? error.message : 'Failed to send Telegram message'
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<TelegramResponse>> {
  try {
    // Validate environment variables
    const botToken = process.env.TG_ACCESS_TOKEN;
    const chatId = process.env.TG_CHAT_ID;

    if (!botToken || !chatId) {
      throw new TelegramError('Telegram configuration is missing', 500);
    }

    // Parse and validate request body
    const body = await req.json();
    
    if (!body.message || !body.userId) {
      throw new TelegramError('Invalid request body: message and userId are required', 400);
    }

    // Send message to Telegram
    await sendTelegramMessage(chatId, body.message, botToken);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
    });

  } catch (error) {
    console.error('Telegram notification error:', error);

    // Handle different types of errors
    if (error instanceof TelegramError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
