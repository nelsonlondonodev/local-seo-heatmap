/**
 * Safely extracts a human-readable error message from an unknown error.
 * Replaces all `catch (error: any)` anti-patterns in the codebase.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido';
}
