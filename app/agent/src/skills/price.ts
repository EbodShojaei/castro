import { Context } from '@xmtp/message-kit';
import type { Skill } from '@xmtp/message-kit';

/**
 * The "price" skill uses its own unique example inputs (natural language sentences).
 */
export const price: Skill[] = [
  {
    skill: 'price',
    handler: handler,
    examples: ['/price', '/price btc', '/price bitcoin'],
    description: 'Get cryptocurrency price.',
  },
];

/**
 * Handler function that responds with a confirmation message when invoked.
 *
 * @param ctx - The context object containing information about the request.
 * @returns A promise that resolves when the reply is sent.
 */
async function handler(ctx: Context): Promise<void> {
  // Send a response message similar to the ping skill.
  await ctx.send({
    message: 'WAGMI.',
    originalMessage: ctx.message,
  });
}
