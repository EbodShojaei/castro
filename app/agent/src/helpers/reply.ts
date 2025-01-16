import { ExtendedContext } from './extendedContext.js';
import mapper from './mapper.js';

/**
 * Processes an incoming message by:
 *   1. Initializing the mapper with the skill’s unique example inputs.
 *   2. Matching the user input sentence to the closest example.
 *   3. Executing the skill based on the incoming message.
 *
 * @param ctx ExtendedContext containing the message and unique example inputs.
 */
export async function reply(ctx: ExtendedContext): Promise<void> {
  const { text } = ctx.message.content;
  if (!text) return;

  try {
    // Initialize the mapper with the unique example inputs.
    await mapper.initialize(ctx);

    // Match the user input to the closest example.
    const matchedCommand = await mapper.getCommand(text);
    console.log(`Matched Example Input: ${matchedCommand}`);
  } catch {
    // console.error(error);
  }

  // Execute the skill normally.
  ctx.executeSkill(text);
}
