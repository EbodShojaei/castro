import { Context } from '@xmtp/message-kit';
import type { Skill } from '@xmtp/message-kit';
import { getCacheKey, setCacheKey } from '../plugins/redis.js';

/**
 * The "price" skill fetches the current price of a cryptocurrency by name only.
 */
export const price: Skill[] = [
  {
    skill: 'price',
    handler: handler,
    examples: [
      '/price bitcoin',
      '/price ethereum',
      '/price solana',
      '/price chainlink',
    ],
    description: 'Get cryptocurrency price.',
    params: {
      id: {
        type: 'string',
      },
    },
  },
];

/**
 * Handler function that responds with a confirmation message when invoked.
 *
 * @param ctx - The context object containing information about the request.
 * @returns A promise that resolves when the reply is sent.
 */
async function handler(context: Context) {
  const {
    message: {
      content: {
        params: { id },
      },
    },
  } = context;

  // Check if id is undefined or invalid
  if (!id || typeof id !== 'string') {
    await context.send({
      message: 'Please provide a valid id. Example: /price bitcoin',
      originalMessage: context.message,
    });
    return;
  }

  // Ensure the id is in lowercase
  const cleanId = id.toLowerCase();

  // Check cache first
  const cacheKey = `price:${cleanId}`;
  const cached = await getCacheKey(cacheKey);
  if (cached) {
    await context.send({
      message: cached,
      originalMessage: context.message,
    });
    return;
  }

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cleanId}`,
  );

  if (!response.ok) {
    context.send({
      message: 'Token not found',
      originalMessage: context.message,
    });
    context.send({
      message: 'Try the full name, like bitcoin instead of btc',
      originalMessage: context.message,
    });
    return;
  }

  const data = (await response.json()) as any;
  const token = data[0];

  if (!token) {
    await context.send({
      message: 'Token not found. Please ensure the id is correct.',
      originalMessage: context.message,
    });
    return;
  }

  const tokenInfo = {
    name: token.name,
    symbol: token.symbol.toUpperCase(),
    price: token.current_price,
    image: token.image,
    link: `https://www.coingecko.com/en/coins/${token.id}`,
  };

  const url = `🚀 ${tokenInfo.name} (${tokenInfo.symbol}) is currently priced at $${tokenInfo.price}.\n\n🔗 [View on CoinGecko] ${tokenInfo.link}`;
  await setCacheKey(cacheKey, url);
  await context.send({ message: url, originalMessage: context.message });
}
