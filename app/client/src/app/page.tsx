'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientOnly from '@/components/shared/ClientOnly';
import Spinner from '@/components/shared/Spinner';
import { useAuthContext } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading, connect, error } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <ClientOnly>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-8 text-4xl font-bold">Castro Chat</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="space-y-4">
            <button
              onClick={connect}
              disabled={isLoading}
              className={`w-full rounded px-4 py-2 text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        )}
      </main>
    </ClientOnly>
  );
}
