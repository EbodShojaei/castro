import axios from 'axios';
import { Model } from './model.js';
import { ModelType } from './types.js';
import { RESPONSES } from '../../constants/responses.js';

export class OllamaModel implements Model {
  private readonly apiUrl: string;

  constructor(
    apiUrl: string = process.env.OLLAMA_API_URL || 'http://ollama:11434/api',
  ) {
    this.apiUrl = apiUrl;
  }

  async generateResponse(
    userPrompt: string,
    systemPrompt: string,
  ): Promise<string> {
    try {
      const response = await axios.post(this.apiUrl + '/chat', {
        model: ModelType.TINYLLAMA,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      });
      const reply = response.data?.message?.content ?? RESPONSES.ERROR;
      return reply.trim();
    } catch (error) {
      console.error('Error interacting with Ollama model:', error);
      throw new Error('Failed to generate response from Ollama model.');
    }
  }
}
