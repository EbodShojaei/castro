import { Context } from '@xmtp/message-kit';

/**
 * ExtendedContext adds an optional "inputs" property,
 * which is an array of example command strings.
 */
export interface ExtendedContext extends Context {
  inputs?: string[];
}
