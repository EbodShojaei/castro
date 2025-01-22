import fs from 'fs';
import { createAgent, Context } from '@xmtp/message-kit';
import { reply } from './helpers/reply.js';
import { ping } from './skills/ping.js';
import { price } from './skills/price.js';

const SYSTEM_PROMPT = fs.existsSync('prompt.md')
  ? fs.readFileSync('prompt.md', 'utf-8')
  : '';

export const agent = createAgent({
  name: 'Castro Agent',
  tag: '@castro',
  systemPrompt: SYSTEM_PROMPT,
  description: 'A data retrieval agent that actively accesses an MLB database.',
  skills: [ping, price],
  onMessage: async (context: Context) => {
    await reply(context);
  },
}).run();
