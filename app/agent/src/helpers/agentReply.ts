import {
  Context,
  chatMemory,
  defaultSystemPrompt,
  parsePrompt,
  processMultilineResponse,
} from '@xmtp/message-kit';
import { ModelFactory } from '../plugins/models/factory.js';
import { ModelType } from '../plugins/models/types.js';
import { RESPONSES } from '../constants/responses.js';

export async function agentReply(ctx: Context) {
  const {
    message: {
      content: { text, params },
      sender,
    },
    agent,
  } = ctx;

  try {
    const systemPrompt = await parsePrompt(
      agent.systemPrompt || defaultSystemPrompt,
      sender.address,
      agent,
    );

    const userPrompt = params?.prompt ?? text;

    const memoryKey = ctx.getMemoryKey(sender.address, ctx.conversation.id);
    chatMemory.createMemory(memoryKey, systemPrompt);
    chatMemory.addEntry(memoryKey, userPrompt, 'user');

    // Use AI Model Factory to create the model
    const aiModel = ModelFactory.createModel(ModelType.TINYLLAMA);
    const reply = await aiModel.generateResponse(userPrompt, systemPrompt);

    const messages = reply.split('\n').filter((msg) => msg.trim().length > 0);
    // Get the message that starts with a slash in the messages array
    let [command] = messages.filter((msg) => msg.startsWith('/'));

    const RETRIES = 3;
    for (let i = 0; i < RETRIES; i++) {
      if (command) {
        break;
      }
      const newReply = await aiModel.generateResponse(userPrompt, systemPrompt);
      const newMessages = newReply
        .split('\n')
        .filter((msg) => msg.trim().length > 0);
      [command] = newMessages.filter((msg) => msg.startsWith('/'));
    }

    if (command.startsWith('/')) {
      // Handle direct commands
      await ctx.executeSkill(command);
    } else {
      await processMultilineResponse(messages, ctx);
      // return { reply };
    }
  } catch (error) {
    console.error('Error during agent reply:', error);
    await ctx.send({
      message: RESPONSES.ERROR,
      originalMessage: ctx.message,
    });
    return { reply: RESPONSES.ERROR };
  }
}
