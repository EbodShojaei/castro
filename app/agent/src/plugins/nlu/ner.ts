import { pipeline } from '@xenova/transformers';
import { EntityRecognitionType } from './types.js';

// Entity Recognition: Extracting specific entities (e.g., Bitcoin, Ethereum).

const MODEL_PATH = '../../models/ner/crypto';

export class NERModel implements EntityRecognitionType {
  /** Named entity recognition model */
  private model: any;

  /**
   * Constructor lazy loads the named entity recognition model
   * @constructor
   */
  constructor() {
    this.model = null;
  }

  /**
   * Function to load the named entity recognition model
   * @returns Promise<void>
   */
  async load(): Promise<void> {
    this.model = await pipeline(
      'ner',
      MODEL_PATH,
      { quantized: true }, // optional for efficiency
    );
  }

  /**
   * Function to extract entities from the input text
   * @param text is the input text to extract entities from
   * @returns Promise<any> is the list of entities, each with a label and score
   */
  private async extractEntities(text: string): Promise<any> {
    return await this.model(text);
  }

  /**
   * Function to extract the best entity from the list of entities
   */
  async extractEntity(text: string): Promise<string> {
    const entities = await this.extractEntities(text);
    if (entities.length === 0) throw new Error('No entities found.');

    return entities[0].entity;
  }
}
