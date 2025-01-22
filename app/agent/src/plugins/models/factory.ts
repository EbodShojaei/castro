import { Model } from './model.js';
import { MistralModel } from './mistral.js';
import { ModelType } from './types.js';

export class ModelFactory {
  static createModel(modelType: ModelType): Model {
    if (modelType === ModelType.MISTRAL) {
      return new MistralModel();
    }

    throw new Error(`Unsupported AI model type: ${modelType}`);
  }
}
