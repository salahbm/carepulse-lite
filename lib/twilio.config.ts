"use server";

import twilio from "twilio";

// Initialize Twilio client with environment variables only if credentials exist
// Make this a private variable, not exported
let twilioClient: ReturnType<typeof twilio> | null = null;

// Only initialize if both environment variables are available
if (process.env.ACCOUNT_SID && process.env.AUTH_TOKEN) {
  twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
}

// Function to send SMS using Twilio
export async function sendTwilioSMS(to: string, body: string) {
  try {
    // Check if Twilio client is initialized
    if (!twilioClient) {
      console.warn("Twilio client not initialized. SMS not sent.");
      return {
        success: false,
        error: "Twilio client not initialized. Check environment variables."
      };
    }
    
    // Check if phone number is available
    if (!process.env.PHONE_NUMBER) {
      console.warn("Twilio phone number not configured. SMS not sent.");
      return {
        success: false,
        error: "Twilio phone number not configured."
      };
    }
    
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
