import * as tf from '@tensorflow-models/universal-sentence-encoder';
import { TextEmbeddingType } from './types';

// Intent Recognition: Identifying the user's command (e.g., /price).

/**
 * NLPModel class for text embedding using TensorFlow
 * @class
 * @implements {EmbeddingType}
 */
export class NLPModel implements TextEmbeddingType {
  /** TensorFlow text embedding model */
  private model: any;

  /**
   * Constructor for the NLPModel class
   * @constructor
   */
  constructor() {
    this.model = null;
  }

  /**
   * Function to load the TensorFlow text embedding model
   * @returns Promise<void>
   */
  async load() {
    this.model = await tf.load();
  }

  /**
   * Function to get the embedding of the input text
   * @param text is the input text to get the embedding of
   * @returns Promise<number[]> is the embedding of the input text
   */
  async getEmbedding(text: string): Promise<number[]> {
    const tensor = await this.model.embed([text]);
    const embedding = await tensor.array();
    tensor.dispose();
    return embedding[0];
  }
}
