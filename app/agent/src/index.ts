import { createAgent, Context } from '@xmtp/message-kit';
import { reply } from './helpers/reply.js';
import { ping } from './skills/ping.js';
import { price } from './skills/price.js';

export const agent = createAgent({
  name: 'Castro Agent',
  tag: '@bot',
  description: 'A data retrieval agent that actively accesses an MLB database.',
  skills: [ping, price],
  onMessage: async (context: Context) => {
    await reply(context);
  },
}).run();
