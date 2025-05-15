'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    const handleAuth = async () => {
      if (!token) {
        router.push('/?error=no_token');
        return;
      }

      try {
        await signInWithCustomToken(auth, token);
        router.push('/dashboard');
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/?error=auth_failed');
      }
    };

    handleAuth();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
} 