import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userData = searchParams.get('user');

    if (!userData) {
      return NextResponse.redirect(new URL('/?error=no_user_data', request.url));
    }

    const user = JSON.parse(userData);
    
    // Vérifier le hash Telegram
    const dataCheckString = Object.keys(user)
      .filter(key => key !== 'hash')
      .map(key => `${key}=${user[key]}`)
      .sort()
      .join('\n');

    const secretKey = crypto.createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN || '')
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== user.hash) {
      return NextResponse.redirect(new URL('/?error=invalid_hash', request.url));
    }

    // Créer un token personnalisé Firebase
    const customToken = await auth.createCustomToken(user.id.toString(), {
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    });

    // Rediriger vers la page de callback avec le token
    return NextResponse.redirect(new URL(`/auth/callback?token=${customToken}`, request.url));
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
} 