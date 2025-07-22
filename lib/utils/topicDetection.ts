export function detectTopicCategory(platform: string, title: string): string {
  const platformLower = platform.toLowerCase()
  const titleLower = title.toLowerCase()

  // Crypto topics
  const cryptoKeywords = ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'token', 'coin']
  if (cryptoKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'crypto'
  }

  // Sports topics
  const sportsKeywords = ['sports', 'nba', 'nfl', 'soccer', 'tennis', 'formula1', 'football', 'basketball', 'baseball']
  if (sportsKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'sports'
  }

  // Finance topics
  const financeKeywords = ['finance', 'investing', 'stocks', 'wallstreet', 'economy', 'market', 'trading']
  if (financeKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'finance'
  }

  // Culture topics
  const cultureKeywords = ['movies', 'music', 'art', 'books', 'television', 'fashion', 'culture', 'photography']
  if (cultureKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'culture'
  }

  // Memes & Humor topics
  const memeKeywords = ['memes', 'funny', 'humor', 'jokes', 'dank', 'viral']
  if (memeKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'memes'
  }

  // Gaming topics
  const gamingKeywords = ['gaming', 'game', 'esports', 'pcgaming', 'xbox', 'playstation', 'nintendo']
  if (gamingKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'gaming'
  }

  // Technology topics
  const techKeywords = ['technology', 'tech', 'science', 'innovation', 'ai', 'machine learning']
  if (techKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'technology'
  }

  // Politics topics
  const politicsKeywords = ['politics', 'worldnews', 'government', 'election']
  if (politicsKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'politics'
  }

  // Lifestyle topics
  const lifestyleKeywords = ['food', 'cooking', 'travel', 'health', 'fitness', 'lifestyle']
  if (lifestyleKeywords.some((keyword) => platformLower.includes(keyword) || titleLower.includes(keyword))) {
    return 'lifestyle'
  }

  return 'general'
}
