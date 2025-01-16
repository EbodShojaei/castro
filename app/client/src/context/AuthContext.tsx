'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import Cookies from 'js-cookie';

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
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      // throw new Error('Please install MetaMask');
      // Show message to install MetaMask if not installed
      setError('Please install MetaMask');
    }

    setIsLoading(true);
    setError(null); // Reset error at the start of the connection attempt
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider is not available');
      }
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any,
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
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    // Call the API to clear the JWT cookie on the server-side
    await fetch('/api/auth/disconnect', { method: 'POST' });
    // Clear authentication state and cookies on the server-side
    setIsAuthenticated(false);
    setAddress(null);
    setClient(null);
    setError(null);
    // Redirect to the home page after disconnect
    router.push('/');
  };

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken) {
      setIsAuthenticated(true);
    }
  }, []);

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
