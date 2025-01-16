'use client';

import { useEffect, useState } from 'react';
import Spinner from './shared/Spinner';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuthContext } from '@/context/AuthContext';
import { chatAPI } from '@/services/api';

interface ChatProps {
  recipientAddress: string;
}

export interface Message {
  id: string;
  senderAddress: string;
  content: string;
  timestamp: number;
}

export default function Chat({ recipientAddress }: ChatProps) {
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, client } = useAuthContext();

  useEffect(() => {
    if (!client || !address || !recipientAddress) return;

    chatAPI.setClient(client);

    const loadMessages = async () => {
      try {
        setError(null);
        const response = await chatAPI.getMessages(recipientAddress);
        if (response.data?.messages) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [recipientAddress, address, client]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !address || !client) return;

    try {
      await chatAPI.sendMessage(recipientAddress, content);
      const response = await chatAPI.getMessages(recipientAddress);
      if (response.data?.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="chat-container">
      {error && <div className="error-banner">{error}</div>}
      <MessageList
        messages={messages}
        userAddress={address || ''}
        recipientAddress={recipientAddress || ''}
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}
