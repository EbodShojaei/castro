import { Context } from '@xmtp/message-kit';
import type { Skill } from '@xmtp/message-kit';

/**
 * Help responds with a list of available commands.
 * @param ctx Context
 * @returns void
 */
export const help: Skill[] = [
  {
    skill: 'help',
    handler: handler,
    examples: ['/help'],
    description: 'Get a list of available commands.',
  },
];

/**
 * Handler function that responds with list of available commands when invoked.
 * @param ctx - The context object containing information about the request.
 * @returns A promise that resolves when the reply is sent.
 */
async function handler(ctx: Context): Promise<void> {
  const helpMessage = `
  Available commands:
  - /help: Get a list of available commands.
  - /ping: Check agent activity if it is healthy or not.
  - /price <name>: Get the price of a token by name (e.g. /price bitcoin).
  `;

  await ctx.send({
    message: helpMessage,
    originalMessage: ctx.message,
  });
  return;
}
