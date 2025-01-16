import { Context } from '@xmtp/message-kit';
import type { Skill } from '@xmtp/message-kit';
import { ExtendedContext } from '../helpers/extendedContext.js';

/**
 * The "price" skill uses its own unique example inputs (natural language sentences).
 */
export const price: Skill[] = [
  {
    skill: 'price',
    handler: handler,
    examples: ['/price'],
    description: 'Determines pricing information for cryptocurrencies.',
  },
];

/**
 * Handler function that responds with a confirmation message when invoked.
 *
 * @param ctx - The context object containing information about the request.
 * @returns A promise that resolves when the reply is sent.
 */
async function handler(ctx: Context): Promise<void> {
  const extCtx = ctx as ExtendedContext;

  // Unique array of example questions for the price skill.
  extCtx.inputs = [
    'What is the price of Bitcoin?',
    'How much is Ethereum trading for?',
    'What is the current value of Dogecoin?',
  ];

  console.log('Price skill invoked with example inputs:', extCtx.inputs);

  // Send a response message similar to the ping skill.
  await ctx.send({
    message: 'Price skill executed.',
    originalMessage: ctx.message,
  });
}
