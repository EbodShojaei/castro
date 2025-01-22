import { Model } from './model.js';
import { OllamaModel } from './ollama.js';
import { ModelType } from './types.js';

export class ModelFactory {
  static createModel(modelType: ModelType): Model {
    if (modelType === ModelType.TINYLLAMA) {
      return new OllamaModel();
    }

    throw new Error(`Unsupported AI model type: ${modelType}`);
  }
}
