'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import Chat from '@/components/Chat';
import ClientOnly from '@/components/shared/ClientOnly';
import Spinner from '@/components/shared/Spinner';

export default function ChatPage() {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [customAddress, setCustomAddress] = useState<string>('');
  const { isAuthenticated, isLoading, address, error } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const handleCustomAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddress) {
      setRecipientAddress(customAddress);
    }
  };

  return (
    <ClientOnly>
      <div className="container mx-auto p-4 text-black">
        {' '}
        {/* Ensure the text color is black */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500 bg-red-100 p-4 rounded-md text-center">
              {error}
            </div>
          </div>
        ) : !isAuthenticated ? null : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex gap-4 items-end">
              <div className="flex-1">
                <form
                  onSubmit={handleCustomAddressSubmit}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="flex-1 rounded border p-2"
                  />
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Chat
                  </button>
                </form>
              </div>
            </div>
            {recipientAddress && address ? (
              recipientAddress === address ? (
                <div
                  className="text-center p-4 bg-yellow-100 rounded-md"
                  role="alert"
                >
                  You cannot chat with your own address
                </div>
              ) : (
                <Chat recipientAddress={recipientAddress} />
              )
            ) : (
              <div className="text-center p-4 rounded-md" role="status"></div>
            )}
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
