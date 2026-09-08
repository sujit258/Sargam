/**
 * Centralized search string normalization and token matching utilities.
 */

/**
 * Normalizes text for search by stripping diacritics and converting to lowercase.
 */
export function normalizeSearchText(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Splits query string into normalized search tokens.
 */
export function tokenizeSearchQuery(query: string): string[] {
  const norm = normalizeSearchText(query).trim();
  return norm ? norm.split(/\s+/).filter(Boolean) : [];
}

/**
 * Checks if all query tokens exist within the provided searchable text parts.
 */
export function matchesAllTokens(tokens: string[], ...parts: (string | undefined | null | string[])[]): boolean {
  if (tokens.length === 0) return true;
  
  const flattened: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (Array.isArray(part)) {
      flattened.push(...part);
    } else {
      flattened.push(part);
    }
  }
  
  const searchableBlob = normalizeSearchText(flattened.join(" "));
  return tokens.every((token) => searchableBlob.includes(token));
}
