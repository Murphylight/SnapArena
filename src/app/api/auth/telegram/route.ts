import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import crypto from 'crypto';
import { TelegramUser } from '@/components/TelegramLoginButton';

// Initialiser Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Fonction pour vérifier la signature Telegram
function verifyTelegramAuth(authData: TelegramUser & { hash: string }): boolean {
  const { hash, ...userData } = authData;
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(k => `${k}=${userData[k as keyof typeof userData]}`)
    .join('\n');
  
  const secretKey = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN || '')
    .digest();
  
  const calculatedHash = crypto.createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

export async function POST(request: Request) {
  try {
    const telegramUser = await request.json();

    // Vérifier la signature Telegram
    if (!verifyTelegramAuth(telegramUser)) {
      return NextResponse.json(
        { error: 'Invalid Telegram authentication' },
        { status: 401 }
      );
    }

    // Créer un token personnalisé Firebase
    const customToken = await getAuth().createCustomToken(telegramUser.id.toString(), {
      telegramId: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
      photoUrl: telegramUser.photo_url,
    });

    return NextResponse.json({ customToken });
  } catch (error) {
    console.error('Error in Telegram auth:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 