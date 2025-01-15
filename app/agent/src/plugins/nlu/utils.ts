/**
 * Function to preprocess text by applying custom regex on it
 * @param text string input to preprocess
 * @param regex regular expression to apply on text
 * @returns string is preprocessed text
 */
export function preprocessText(
  text: string,
  regex: RegExp = /[^\w\s]/g,
): string {
  return text.replace(regex, '').trim();
}

/**
 * Function to normalize a vector
 * @param vector number[] input vector to normalize
 * @returns number[] is normalized vector
 */
export function normalize(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? vector.map((val) => val / magnitude) : vector;
}

/**
 * Function to calculate cosine similarity between two vectors
 * @param a number[] input vector a
 * @param b number[] input vector b
 * @returns number is scalar value of cosine similarity between a and b
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}
