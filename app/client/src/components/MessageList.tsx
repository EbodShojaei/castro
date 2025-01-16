'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/components/Chat';

interface MessageListProps {
  messages: Message[];
  userAddress: string;
  recipientAddress: string;
}

export default function MessageList({
  messages,
  userAddress,
  recipientAddress,
}: MessageListProps) {
  const receiver = recipientAddress.substring(0, 6) + '...';
  const messageListRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom whenever messages change unless user is not at bottom
  useEffect(() => {
    if (messageListRef.current) {
      const scrollHeight = messageListRef.current.scrollHeight;
      const clientHeight = messageListRef.current.clientHeight;
      const scrollTop = messageListRef.current.scrollTop;

      // Check if user is at bottom of chat
      if (scrollHeight - scrollTop === clientHeight) {
        setIsAtBottom(true);
      }
    }
  }, [messages]);

  // Scroll to bottom only if user is at bottom
  useEffect(() => {
    if (isAtBottom && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // Detect if user is manually scrolling
  const handleScroll = () => {
    if (messageListRef.current) {
      const scrollHeight = messageListRef.current.scrollHeight;
      const clientHeight = messageListRef.current.clientHeight;
      const scrollTop = messageListRef.current.scrollTop;

      // If user is not at bottom, prevent auto-scroll
      setIsAtBottom(scrollHeight - scrollTop === clientHeight);
    }
  };

  return (
    <div
      className="mb-4 h-[500px] overflow-y-auto"
      ref={messageListRef}
      onScroll={handleScroll}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`m-2 flex ${
            message.senderAddress === userAddress
              ? 'justify-end'
              : 'justify-start'
          }`}
        >
          <div
            className={`rounded-lg px-4 py-2 ${
              message.senderAddress === userAddress
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            <div className="text-sm opacity-75">
              {message.senderAddress === userAddress ? 'You' : receiver}
            </div>
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}
