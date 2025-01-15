import { Context, createAgent } from '@xmtp/message-kit';
import { reply } from './helpers/reply.js';
import { ping } from './skills/ping.js';

/**
 * The agent is the main entry point of the application.
 *
 * It is responsible for creating the Castro agent and running it.
 * This monolithic agent can be broken down into smaller agents in the future.
 * Think of this agent as Agent Smith. It is the one agent to rule them all.
 *
 * properties:
 * - name: The name of the agent.
 * - tag: The tag of the agent.
 * - description: The description of the agent.
 * - skills: The skills that the agent has.
 * - onMessage: The function that handles the message.
 *
 * @returns void
 */
export const agent = createAgent({
  name: 'Castro Agent',
  tag: '@bot',
  description: 'A data retrieval agent that actively accesses an MLB database.',
  skills: [ping],
  onMessage: async (context: Context) => {
    await reply(context);
  },
}).run();
