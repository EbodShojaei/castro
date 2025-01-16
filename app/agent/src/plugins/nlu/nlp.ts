import * as use from '@tensorflow-models/universal-sentence-encoder';
import { TextEmbeddingType } from './types.js';
import { preprocessText } from './utils.js';

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
    this.model = await use.load();
  }

  /**
   * Function to get the embedding of the input text
   * @param example is the input text to get the embedding of
   * @returns Promise<number[]> is the embedding of the input text
   */
  async getEmbedding(example: string | string[]): Promise<number[]> {
    // If length of text is greater than 1, compute the averaged embedding
    if (Array.isArray(example)) return this.getBatchEmbedding(example);

    // Preprocess the input example
    example = preprocessText(example);

    const tensor = await this.model.embed([example]);
    const embedding = await tensor.array();
    tensor.dispose();
    return embedding[0];
  }

  /**
   * Function to compute the averaged embedding of the input examples
   * @param examples is the input examples to compute the averaged embedding of
   * @returns Promise<number[]> is the averaged embedding of the input examples
   */
  private async getBatchEmbedding(examples: string[]): Promise<number[]> {
    if (!examples || examples.length === 0) {
      throw new Error('Input examples array cannot be empty.');
    }

    // Preprocess the input examples
    examples = examples.map((example) => preprocessText(example));

    // Batch embedding for efficiency
    const tensors = await this.model.embed(examples);
    const embeddings = await tensors.array(); // Extract the embeddings as arrays
    tensors.dispose(); // Free memory used by tensors

    // Calculate the element-wise sum of embeddings
    const summedEmbedding = embeddings.reduce(
      (sum: number[], embedding: number[]) =>
        sum.map((val, i) => val + embedding[i]),
      Array(embeddings[0].length).fill(0), // Initialize a zeroed vector of the same size
    );

    // Calculate the average embedding
    const avgEmbedding = summedEmbedding.map(
      (val: number) => val / embeddings.length,
    );

    // Normalize the averaged embedding
    const magnitude = Math.sqrt(
      avgEmbedding.reduce((sum: number, val: number) => sum + val * val, 0),
    );
    return magnitude > 0
      ? avgEmbedding.map((val: number) => val / magnitude)
      : avgEmbedding;
  }
}
