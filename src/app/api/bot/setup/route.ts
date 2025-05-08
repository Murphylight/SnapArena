import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function GET() {
  try {
    // Obtenir l'URL du webhook
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://snaparena.vercel.app'}/api/bot`;
    
    // Configurer le webhook
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
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

    if (!data.ok) {
      throw new Error(data.description || 'Failed to set webhook');
    }

    return NextResponse.json({ success: true, message: 'Webhook configured successfully' });
  } catch (error) {
    console.error('Error setting up webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 