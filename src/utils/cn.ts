import clsx from 'clsx';

/**
 * Utility function to merge class names
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
  return clsx(inputs);
}
