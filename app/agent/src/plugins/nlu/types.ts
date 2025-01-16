/**
 * Model interface for plugins
 * @interface
 * @method load loads the model
 */
interface Model {
  load(): Promise<void>;
}

/**
 * TextEmbeddingType interface for text embedding plugins
 * @interface
 * @method load loads the embedding model
 * @method getEmbedding returns the embedding of the input text
 */
export interface TextEmbeddingType extends Model {
  load(): Promise<void>;
  getEmbedding(text: string | string[]): Promise<number[]>;
}

/**
 * EntityRecognitionType interface for named entity recognition plugins
 * @interface
 * @method load loads the entity recognition model
 * @method extractEntities returns the entities in the input text
 */
export interface EntityRecognitionType extends Model {
  load(): Promise<void>;
  extractEntity(text: string): Promise<string>;
}

/**
 * NaturalLanguageType interface for natural language understanding plugins
 * @interface
 * @method load loads the NLU model
 * @method getEmbedding returns the embedding of the input text
 * @method extractEntity returns the entities in the input text
 */
export interface NaturalLanguageType extends Model {
  load(): Promise<void>;
  getEmbedding(text: string | string[]): Promise<number[]>;
  extractEntity(text: string): Promise<string>;
}
