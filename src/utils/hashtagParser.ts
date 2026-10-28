/**
 * Hashtag extraction, normalization, and autocomplete suggestions engine
 */

export const POPULAR_HASHTAGS = [
  '#MediaSourceHub',
  '#RanjeetKumar',
  '#Bihar',
  '#Patna',
  '#Trending',
  '#ViralReels',
  '#CreatorHub',
  '#TechIndia',
  '#DesiVibes',
  '#BhojpuriHits',
  '#Bollywood',
  '#DigitalCreator',
  '#VerifiedBadge',
  '#Photography',
  '#TravelDiaries',
  '#MusicLover',
  '#ReelsOfInstagram',
  '#LiveBroadcast',
  '#CyberSecurity',
  '#E2EEMessaging'
];

/**
 * Extracts all unique #hashtags from text caption
 */
export function extractHashtags(caption: string): string[] {
  if (!caption) return [];
  const regex = /#([a-zA-Z0-9_\u0900-\u097F]+)/g;
  const matches = caption.match(regex);
  if (!matches) return [];
  
  // Normalize to unique and lower-case or capitalized as written
  const uniqueTags = Array.from(new Set(matches.map(tag => tag.trim())));
  return uniqueTags;
}

/**
 * Autocomplete matching for currently typed hashtag
 */
export function getHashtagSuggestions(query: string, limit = 6): string[] {
  if (!query) return POPULAR_HASHTAGS.slice(0, limit);
  const cleanQuery = query.startsWith('#') ? query.toLowerCase() : `#${query.toLowerCase()}`;
  
  const filtered = POPULAR_HASHTAGS.filter(tag => 
    tag.toLowerCase().includes(cleanQuery)
  );

  // If user typed a custom new tag that isn't in popular, offer it first
  if (!filtered.some(t => t.toLowerCase() === cleanQuery) && cleanQuery.length > 1) {
    return [cleanQuery, ...filtered].slice(0, limit);
  }

  return filtered.slice(0, limit);
}

/**
 * Validates a hashtag string
 */
export function isValidHashtag(tag: string): boolean {
  if (!tag) return false;
  const clean = tag.startsWith('#') ? tag.slice(1) : tag;
  return /^[a-zA-Z0-9_\u0900-\u097F]{2,30}$/.test(clean);
}
