import { Context } from '@xmtp/message-kit';
import type { Skill } from '@xmtp/message-kit';

const inputs = ['ping', 'ping pong', 'ping-pong'];

/**
 * Ping pong checks if server aka agent healthy or not.
 * Client sends a ping request and server responds with pong.
 * Either bad server or bad network can cause ping failure.
 *
 * @param ctx Context
 * @returns void
 */
export const ping: Skill[] = [
  {
    skill: 'ping',
    handler: handler,
    examples: ['/ping', ...inputs],
    description: 'Check agent activity.',
  },
];

/**
 * Handler function that responds with "pong" when invoked.
 *
 * @param ctx - The context object containing information about the request.
 * @returns A promise that resolves when the reply is sent.
 */
async function handler(ctx: Context): Promise<void> {
  await ctx.send({
    message: 'pong',
    originalMessage: ctx.message,
  });
  return;
}
