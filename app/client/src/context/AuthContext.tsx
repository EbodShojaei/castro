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
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
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
      // Check if MetaMask is available
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask');
        return;
      }

      const provider = new ethers.providers.Web3Provider(
        window.ethereum as ExternalProvider,
      );

      // Get the list of accounts
      const accounts = await provider.listAccounts();

      // If accounts are available (MetaMask is unlocked)
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        // Proceed with authentication and JWT token generation
        await authenticateAndSetUser(userAddress, provider);
      } else {
        // If no accounts found (MetaMask is locked), request account access
        try {
          const accountsFromRequest = (await window.ethereum.request({
            method: 'eth_requestAccounts',
          })) as string[];

          if (accountsFromRequest.length > 0) {
            const userAddress = accountsFromRequest[0];
            // Proceed with authentication and JWT token generation
            await authenticateAndSetUser(userAddress, provider);
          } else {
            setError('No account found');
          }
        } catch {
          // Handle user rejection
          setError('MetaMask connection request was rejected');
        }
      }
    } catch {
      setError('Failed to connect. Please check MetaMask is unlocked.');
      // Disconnect if there is an error during connection
      disconnect();
    }
  };

  // Centralized function to authenticate and set the user address
  const authenticateAndSetUser = async (
    userAddress: string,
    provider: ethers.providers.Web3Provider,
  ) => {
    setAddress(userAddress);
    setIsAuthenticated(true);

    // Set up XMTP client and authenticate
    const clientInstance = await Client.create(provider.getSigner(), {
      env: 'production', // Ensure using the production environment for XMTP
    });
    setClient(clientInstance);

    // Call API to authenticate and set JWT token in cookies
    const response = await fetch('/api/auth/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: userAddress }),
      credentials: 'same-origin',
    });

    if (!response.ok) {
      setError('Failed to authenticate. Please try again.');
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
