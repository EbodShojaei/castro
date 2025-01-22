import { Context } from '@xmtp/message-kit';
import { agentReply } from './agentReply.js';
import { RESPONSES } from '../constants/responses.js';

const MAX_TOKEN_LENGTH = 500;

/**
 * Reply function that handles the message.
 * Direct handling runs hot commands without any delay (AI processing).
 * Else it will be processed by the AI.
 *
 * @param ctx Context
 * @returns void
 */
export async function reply(ctx: Context): Promise<void> {
  try {
    const { text } = ctx.message.content;
    if (!text) return;

    // If the text exceeds the maximum length, return an error message
    if (text.length > MAX_TOKEN_LENGTH) {
      await ctx.send({
        message: RESPONSES.EXCEEDS_MAX_LENGTH,
        originalMessage: ctx.message,
      });
      return;
    }

    if (text.startsWith('/')) {
      // Handle direct commands
      await ctx.executeSkill(text);
    } else {
      // Pass non-command messages to the AI agent
      await agentReply(ctx);
    }
  } catch (error) {
    console.error('Error during reply:', error);
    await ctx.send({
      message: RESPONSES.ERROR,
      originalMessage: ctx.message,
    });
  }
}
