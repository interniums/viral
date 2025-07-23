// Platform Enums
export enum Platform {
  Reddit = 'Reddit',
  YouTube = 'YouTube',
  GoogleTrends = 'Google Trends',
  HackerNews = 'Hacker News',
  GitHub = 'GitHub',
  StackOverflow = 'Stack Overflow',
  ProductHunt = 'Product Hunt',
  Twitch = 'Twitch',
  Mastodon = 'Mastodon',
  GNews = 'GNews',
  CoinGecko = 'CoinGecko',
  DevTo = 'Dev.to',
  Steam = 'Steam',
  TheGuardian = 'The Guardian',
  Binance = 'Binance',
}

export enum PlatformCategory {
  Social = 'social',
  News = 'news',
  Tech = 'tech',
  Gaming = 'gaming',
  Crypto = 'crypto',
  Entertainment = 'entertainment',
}

export enum PlatformStatus {
  Active = 'active',
  Demo = 'demo',
  Beta = 'beta',
}

// Topic Enums
export enum Topic {
  General = 'general',
  Technology = 'technology',
  Programming = 'programming',
  ArtificialIntelligence = 'artificial-intelligence',
  AI = 'ai',
  Frontend = 'frontend',
  Backend = 'backend',
  Mobile = 'mobile',
  Database = 'database',
  DevOps = 'devops',
  Security = 'security',
  Blockchain = 'blockchain',
  OpenSource = 'open-source',
  Entertainment = 'entertainment',
  Memes = 'memes',
  Finance = 'finance',
  Business = 'business',
  Startups = 'startups',
  Products = 'products',
  Gaming = 'gaming',
  FPS = 'fps',
  MOBA = 'moba',
  BattleRoyale = 'battle-royale',
  Sandbox = 'sandbox',
  RPG = 'rpg',
  Strategy = 'strategy',
  Simulation = 'simulation',
  News = 'news',
  World = 'world',
  Politics = 'politics',
  Environment = 'environment',
  Health = 'health',
  Crypto = 'crypto',
  Cryptocurrency = 'cryptocurrency',
  DeFi = 'defi',
  MemeCoins = 'meme-coins',
  MajorCrypto = 'major-crypto',
  Trending = 'trending',
  Declining = 'declining',
  Lifestyle = 'lifestyle',
  Culture = 'culture',
  SocialMedia = 'social-media',
  Sports = 'sports',
}

export enum TopicCategory {
  General = 'general',
  Technology = 'technology',
  Entertainment = 'entertainment',
  Finance = 'finance',
  Gaming = 'gaming',
  News = 'news',
  Crypto = 'crypto',
  Lifestyle = 'lifestyle',
  Sports = 'sports',
  Politics = 'politics',
}

// Helper types
export type PlatformKey = keyof typeof Platform
export type TopicKey = keyof typeof Topic
export type PlatformCategoryKey = keyof typeof PlatformCategory
export type TopicCategoryKey = keyof typeof TopicCategory
