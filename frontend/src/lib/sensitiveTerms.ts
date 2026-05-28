import type { SensitiveMatch } from '../types';

export function normalizeTerms(rawTerms: string[]): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const rawTerm of rawTerms) {
    const term = rawTerm.trim();
    const key = term.toLowerCase();
    if (!term || seen.has(key)) {
      continue;
    }
    seen.add(key);
    terms.push(term);
  }
  return terms;
}

export function parseTermsText(value: string): string[] {
  return normalizeTerms(value.split(/[\n,，、]+/));
}

export function findSensitiveMatches(text: string, terms: string[]): SensitiveMatch[] {
  const lowered = text.toLowerCase();
  return normalizeTerms(terms)
    .map((term) => ({
      term,
      count: lowered.split(term.toLowerCase()).length - 1,
    }))
    .filter((match) => match.count > 0);
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
