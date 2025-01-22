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

export async function agentReply(context: Context) {
  const {
    message: {
      content: { text, params },
      sender,
    },
    agent,
  } = context;

  try {
    const systemPrompt = await parsePrompt(
      agent.systemPrompt || defaultSystemPrompt,
      sender.address,
      agent,
    );

    const userPrompt = params?.prompt ?? text;

    const memoryKey = context.getMemoryKey(
      sender.address,
      context.conversation.id,
    );
    chatMemory.createMemory(memoryKey, systemPrompt);
    chatMemory.addEntry(memoryKey, userPrompt, 'user');

    // Use AI Model Factory to create the model
    const aiModel = ModelFactory.createModel(ModelType.TINYLLAMA);
    const reply = await aiModel.generateResponse(userPrompt, systemPrompt);

    const messages = reply.split('\n').filter((msg) => msg.trim().length > 0);
    await processMultilineResponse(messages, context);

    return { reply };
  } catch (error) {
    console.error('Error during agent reply:', error);
    await context.send({
      message: RESPONSES.ERROR,
      originalMessage: context.message,
    });
    return { reply: RESPONSES.ERROR };
  }
}
