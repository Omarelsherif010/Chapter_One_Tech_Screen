/**
 * Generates a unique ID for a task.
 * Uses timestamp + random suffix to ensure uniqueness without external dependencies.
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
