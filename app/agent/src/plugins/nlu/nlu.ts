import {
  NaturalLanguageType,
  TextEmbeddingType,
  EntityRecognitionType,
} from './types.js';

// Natural Language Processing (NLP) focused on extracting structured meaning from unstructured text.

/**
 * NLUModel class for natural language understanding
 * @class
 * @implements {NaturalLanguageType}
 */
export class NLUModel implements NaturalLanguageType {
  /** Text embedding model */
  private embedding: TextEmbeddingType;

  /** Named entity recognition model */
  private entityRecognition: EntityRecognitionType;

  /**
   * Constructor for the NLUModel class
   * @constructor
   * @param {TextEmbeddingType} embedding is the text embedding model
   * @param {EntityRecognitionType} entityRecognition is the entity recognition model
   */
  constructor(
    embedding: TextEmbeddingType,
    entityRecognition: EntityRecognitionType,
  ) {
    this.embedding = embedding;
    this.entityRecognition = entityRecognition;
  }

  /**
   * Function to load the text embedding and entity recognition models
   * @returns Promise<void>
   */
  async load() {
    await this.embedding.load();
    await this.entityRecognition.load();
  }

  /**
   * Function to get the embedding of the input text
   * @param text is the input text to get the embedding of
   * @returns Promise<number[]> is the embedding of the input text
   */
  async getEmbedding(text: string | string[]): Promise<number[]> {
    return this.embedding.getEmbedding(text);
  }

  /**
   * Function to get the entities in the input text
   * @param text is the input text to extract entities from
   * @returns Promise<string[]> is the list of entities extracted from the input text
   */
  async extractEntity(text: string): Promise<string> {
    return this.entityRecognition.extractEntity(text);
  }
}
