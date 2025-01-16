import { Client } from '@xmtp/xmtp-js';

interface ChatAPIResponse {
  data?: {
    messages: Array<{
      id: string;
      senderAddress: string;
      content: string;
      timestamp: number;
    }>;
  };
}

class ChatAPI {
  private client: Client | null = null;

  setClient(client: Client) {
    this.client = client;
  }

  async sendMessage(recipientAddress: string, content: string): Promise<void> {
    if (!this.client) throw new Error('XMTP client not initialized');

    const conversation =
      await this.client.conversations.newConversation(recipientAddress);
    await conversation.send(content);
  }

  async getMessages(recipientAddress: string): Promise<ChatAPIResponse> {
    if (!this.client) throw new Error('XMTP client not initialized');

    const conversation =
      await this.client.conversations.newConversation(recipientAddress);
    const messages = await conversation.messages();

    return {
      data: {
        messages: messages.map((msg) => ({
          id: msg.id,
          senderAddress: msg.senderAddress,
          content: msg.content,
          timestamp: msg.sent.getTime(),
        })),
      },
    };
  }
}

export const chatAPI = new ChatAPI();
