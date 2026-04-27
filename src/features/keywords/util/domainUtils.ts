/**
 * Cleans a URL string to return only the domain name.
 * Example: https://www.google.com/search -> google.com
 */
export function cleanDomain(url: string): string {
  return url
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
    .split('/')[0]
    .toLowerCase();
}
