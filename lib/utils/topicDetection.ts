import { Platform, Topic } from '../constants/enums'

export function detectTopicCategory(platform: Platform, title: string): Topic {
  const platformStr = platform.toLowerCase()
  const titleLower = title.toLowerCase()

  // Crypto topics
  const cryptoKeywords = ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'token', 'coin']
  if (cryptoKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Cryptocurrency
  }

  // Sports topics
  const sportsKeywords = ['sports', 'nba', 'nfl', 'soccer', 'tennis', 'formula1', 'football', 'basketball', 'baseball']
  if (sportsKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Sports
  }

  // Finance topics
  const financeKeywords = ['finance', 'investing', 'stocks', 'wallstreet', 'economy', 'market', 'trading']
  if (financeKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Finance
  }

  // Culture topics
  const cultureKeywords = ['movies', 'music', 'art', 'books', 'television', 'fashion', 'culture', 'photography']
  if (cultureKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Culture
  }

  // Memes & Humor topics
  const memeKeywords = ['memes', 'funny', 'humor', 'jokes', 'dank', 'viral']
  if (memeKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Memes
  }

  // Gaming topics
  const gamingKeywords = ['gaming', 'game', 'esports', 'pcgaming', 'xbox', 'playstation', 'nintendo']
  if (gamingKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Gaming
  }

  // Technology topics
  const techKeywords = ['technology', 'tech', 'science', 'innovation', 'ai', 'machine learning']
  if (techKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Technology
  }

  // Politics topics
  const politicsKeywords = ['politics', 'worldnews', 'government', 'election']
  if (politicsKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Politics
  }

  // Lifestyle topics
  const lifestyleKeywords = ['food', 'cooking', 'travel', 'health', 'fitness', 'lifestyle']
  if (lifestyleKeywords.some((keyword) => platformStr.includes(keyword) || titleLower.includes(keyword))) {
    return Topic.Lifestyle
  }

  // Platform-specific defaults
  switch (platform) {
    case Platform.GitHub:
      return Topic.Programming
    case Platform.StackOverflow:
      return Topic.Programming
    case Platform.DevTo:
      return Topic.Programming
    case Platform.ProductHunt:
      return Topic.Products
    case Platform.Twitch:
      return Topic.Gaming
    case Platform.CoinGecko:
    case Platform.Binance:
      return Topic.Cryptocurrency
    case Platform.GNews:
    case Platform.TheGuardian:
      return Topic.News
    case Platform.Reddit:
    case Platform.Mastodon:
      return Topic.SocialMedia
    case Platform.YouTube:
      return Topic.Entertainment
    default:
      return Topic.General
  }
}
