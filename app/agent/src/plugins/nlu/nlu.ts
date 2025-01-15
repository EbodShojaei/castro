import {
  NaturalLanguageType,
  TextEmbeddingType,
  EntityRecognitionType,
} from './types';

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
   * Function to process the input text
   * @param text is the input text to process
   * @returns Promise<{ entities: string[]; embedding: number[] }> is the entities and embedding of the input text
   */
  async process(text: string) {
    const entities = await this.entityRecognition.extractEntities(text);
    const embedding = await this.embedding.getEmbedding(text);
    return { entities, embedding };
  }
}
