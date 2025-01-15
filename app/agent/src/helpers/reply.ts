import { Context } from '@xmtp/message-kit';

/**
 * Reply function that handles the message.
 * Direct handling runs hot commands without any delay (AI processing).
 * Else it will be processed by the AI.
 *
 * @param ctx Context
 * @returns void
 */
export async function reply(ctx: Context): Promise<void> {
  const { text } = ctx.message.content;
  if (!text) return;
  if (!text.startsWith('/')) return; // this is where the magic happens 🪄
  // TODO: agentReply(ctx);

  // Handle direct commands
  ctx.executeSkill(text);
}
