import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://snap-arena-5meo.vercel.app';

async function setupWebhook() {
  try {
    const webhookUrl = `${APP_URL}/api/bot`;
    console.log('Setting up webhook for URL:', webhookUrl);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();
    console.log('Webhook setup response:', data);

    if (!data.ok) {
      throw new Error(data.description || 'Failed to set webhook');
    }

    console.log('Webhook configured successfully!');
  } catch (error) {
    console.error('Error setting up webhook:', error);
  }
}

setupWebhook(); 