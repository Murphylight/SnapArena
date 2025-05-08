import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received webhook:', body);

    // Gérer la commande /start
    if (body.message?.text === '/start') {
      const chatId = body.message.chat.id;
      const firstName = body.message.from.first_name;
      
      await sendMessage(
        chatId,
        `👋 Bonjour ${firstName} !\n\nBienvenue sur SnapArena. Pour commencer à jouer, cliquez sur le bouton ci-dessous :`,
      );

      // Envoyer le bouton de menu
      await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🎮 Lancer SnapArena',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🎮 Lancer SnapArena',
                  web_app: { url: process.env.NEXT_PUBLIC_APP_URL || 'https://snaparena.vercel.app' }
                }
              ]
            ]
          }
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 