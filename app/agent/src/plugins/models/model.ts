export interface Model {
  /**
   * Generate a response based on the user's prompt and system prompt.
   *
   * @param userPrompt The user's query or message.
   * @param systemPrompt The system's context or instructions.
   * @returns The generated response as a string.
   */
  generateResponse(userPrompt: string, systemPrompt: string): Promise<string>;
}
