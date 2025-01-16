import {
  NLPModel,
  NERModel,
  NLUModel,
  preprocessText,
  cosineSimilarity,
} from '../plugins/nlu/index.js';
import { ExtendedContext } from './extendedContext.js';

/**
 * Interface defining the mapper's public method.
 */
export interface I_Mapper {
  getCommand(input: string): Promise<string>;
}

export class Mapper implements I_Mapper {
  /** Natural language understanding model */
  private nlu: NLUModel;

  /** Precomputed embeddings for the example inputs */
  private embeddings: number[][] = [];

  /** Storage for example command inputs */
  private inputs: string[] = [];

  /** Similarity threshold for matching commands */
  private threshold: number;

  /**
   * Constructor for the Mapper class.
   * @param threshold Similarity threshold for matching commands (default: 0.7)
   */
  constructor(threshold: number = 0.7) {
    this.nlu = new NLUModel(new NLPModel(), new NERModel());
    this.threshold = threshold;
  }

  /**
   * Initialize the Mapper by loading models and computing embeddings
   * from the example commands provided via ExtendedContext.inputs.
   *
   * @param ctx ExtendedContext containing the inputs array.
   * @throws if the inputs array is empty.
   */
  async initialize(ctx: ExtendedContext): Promise<void> {
    const inputs = ctx.inputs;
    if (!inputs || inputs.length === 0) {
      throw new Error('Inputs array is empty.');
    }
    // Save the inputs for later matching.
    this.inputs = inputs;

    // Load the NLU model.
    await this.nlu.load();

    // Compute the embeddings for each provided example command.
    this.embeddings = await Promise.all(
      inputs.map(async (command) => {
        return await this.nlu.getEmbedding(command);
      }),
    );
    console.log('Mapper: Command embeddings initialized.');
  }

  /**
   * Compute which command best matches the input text.
   *
   * @param input User input text.
   * @returns Promise<number> Index of the best matching command or -1 if no match is found.
   */
  private async match(input: string): Promise<number> {
    if (!this.inputs || this.inputs.length === 0) {
      throw new Error('No command inputs available.');
    }
    const cleanedInput = preprocessText(input);
    const inputEmbedding = await this.nlu.getEmbedding(cleanedInput);

    let maxSimilarity = -1;
    let bestMatchIndex = -1;

    this.embeddings.forEach((commandEmbedding, i) => {
      const similarity = cosineSimilarity(inputEmbedding, commandEmbedding);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        bestMatchIndex = i;
      }
    });
    return maxSimilarity > this.threshold ? bestMatchIndex : -1;
  }

  /**
   * From the user input, retrieve both the matched command and an extracted entity.
   *
   * @param input User input text.
   * @returns Promise containing the command string and a detected entity.
   * @throws if no commands are set or no match is found.
   */
  private async getCommandAndEntity(
    input: string,
  ): Promise<{ command: string; entity: string }> {
    if (!this.inputs || this.inputs.length === 0) {
      throw new Error('Commands array is empty.');
    }
    const bestMatchIndex = await this.match(input);
    if (bestMatchIndex === -1) {
      throw new Error('No matching command found.');
    }
    // Get the command from the stored inputs.
    const command = this.inputs[bestMatchIndex];

    // Extract an entity from the user input.
    // (Depending on your NLUModel, this might return a string representing the entity.)
    const entity = await this.nlu.extractEntity(input);
    return { command, entity };
  }

  /**
   * Public method to obtain the matched command from the user input.
   *
   * @param input User input text.
   * @returns Promise<string> The command string which best matches the input.
   */
  async getCommand(input: string): Promise<string> {
    const { command } = await this.getCommandAndEntity(input);
    return command;
  }
}

// Create a singleton Mapper instance.
const mapper = new Mapper();
export default mapper;
