import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userData = searchParams.get('user');

    console.log('Received user data:', userData);

    if (!userData) {
      console.error('No user data provided');
      return NextResponse.redirect(new URL('/?error=no_user_data', request.url));
    }

    const user = JSON.parse(userData);
    console.log('Parsed user data:', user);
    
    // Vérifier le hash Telegram
    const dataCheckString = Object.keys(user)
      .filter(key => key !== 'hash')
      .map(key => `${key}=${user[key]}`)
      .sort()
      .join('\n');

    console.log('Data check string:', dataCheckString);

    const secretKey = crypto.createHash('sha256')
      .update(process.env.TELEGRAM_BOT_TOKEN || '')
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    console.log('Calculated hash:', calculatedHash);
    console.log('Received hash:', user.hash);

    if (calculatedHash !== user.hash) {
      console.error('Invalid hash');
      return NextResponse.redirect(new URL('/?error=invalid_hash', request.url));
    }

    console.log('Creating custom token for user:', user.id);
    
    // Créer un token personnalisé Firebase
    const customToken = await auth.createCustomToken(user.id.toString(), {
      telegram_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    });

    console.log('Custom token created successfully');

    // Rediriger vers la page de callback avec le token
    const callbackUrl = new URL(`/auth/callback?token=${customToken}`, request.url);
    console.log('Redirecting to:', callbackUrl.toString());
    
    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error('Telegram auth error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
} 