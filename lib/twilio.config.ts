"use server";

import twilio from "twilio";

// Initialize Twilio client with environment variables
// Make this a private variable, not exported
const twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Function to send SMS using Twilio
export async function sendTwilioSMS(to: string, body: string) {
  try {
    const message = await twilioClient.messages.create({
      body,
      from: process.env.PHONE_NUMBER,
      to,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error("Error sending SMS with Twilio:", error);
    return {
      success: false,
      error,
    };
  }
}
