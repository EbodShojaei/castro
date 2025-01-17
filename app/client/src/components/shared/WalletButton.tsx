'use client';

import React from 'react';
import { useAuthContext } from '@/context/AuthContext';

const WalletButton: React.FC = () => {
  const { isAuthenticated, isLoading, connect, disconnect } = useAuthContext();

  const handleClick = async () => {
    if (isAuthenticated) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded text-white ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : isAuthenticated
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {isLoading
        ? 'Connecting...'
        : isAuthenticated
          ? 'Disconnect Wallet'
          : 'Connect Wallet'}
    </button>
  );
};

export default WalletButton;
