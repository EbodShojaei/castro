'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import Spinner from '@/components/shared/Spinner';
import { ExternalProvider } from '@ethersproject/providers';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  address: string | null;
  error: string | null;
  client: Client | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Set loading to true initially
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setAddress(data.address);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const connect = async () => {
    setError(null); // Reset error at the start of the connection attempt
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as ExternalProvider,
      );
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const clientInstance = await Client.create(provider.getSigner(), {
          env: 'production',
        });
        setClient(clientInstance);

        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsAuthenticated(true);

        // Call API to authenticate and set JWT token in cookies
        const response = await fetch('/api/auth/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: userAddress }),
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }
      } else {
        setError('No account found');
      }
    } catch {
      setError('Failed to connect. Please make sure MetaMask is unlocked.');
    }
  };

  const disconnect = async () => {
    await fetch('/api/auth/disconnect', { method: 'POST' });
    setIsAuthenticated(false);
    setAddress(null);
    setClient(null);
    setError(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        address,
        error,
        client,
        connect,
        disconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
