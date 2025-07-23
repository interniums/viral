import { Topic as TopicEnum, TopicCategory } from './enums'

export interface Topic {
  key: TopicEnum
  label: string
  icon: string
  category: TopicCategory
  description: string
  color: string
  tags: string[]
}

export const TOPICS: Topic[] = [
  // General
  {
    key: TopicEnum.General,
    label: 'General',
    icon: '🌐',
    category: TopicCategory.General,
    description: 'General trending topics and discussions',
    color: 'gray',
    tags: ['general', 'trending', 'popular'],
  },

  // Technology
  {
    key: TopicEnum.Technology,
    label: 'Technology',
    icon: '💻',
    category: TopicCategory.Technology,
    description: 'Technology news, innovations, and developments',
    color: 'blue',
    tags: ['tech', 'innovation', 'software', 'hardware'],
  },
  {
    key: TopicEnum.Programming,
    label: 'Programming',
    icon: '👨‍💻',
    category: TopicCategory.Technology,
    description: 'Programming languages, frameworks, and development',
    color: 'blue',
    tags: ['coding', 'development', 'software', 'programming'],
  },
  {
    key: TopicEnum.ArtificialIntelligence,
    label: 'AI & ML',
    icon: '🤖',
    category: TopicCategory.Technology,
    description: 'Artificial intelligence and machine learning',
    color: 'purple',
    tags: ['ai', 'ml', 'machine-learning', 'neural-networks'],
  },
  {
    key: TopicEnum.AI,
    label: 'AI',
    icon: '🤖',
    category: TopicCategory.Technology,
    description: 'Artificial intelligence developments',
    color: 'purple',
    tags: ['artificial-intelligence', 'ai', 'automation'],
  },
  {
    key: TopicEnum.Frontend,
    label: 'Frontend',
    icon: '🎨',
    category: TopicCategory.Technology,
    description: 'Frontend development and web technologies',
    color: 'blue',
    tags: ['frontend', 'web', 'ui', 'ux', 'react', 'vue', 'angular'],
  },
  {
    key: TopicEnum.Backend,
    label: 'Backend',
    icon: '⚙️',
    category: TopicCategory.Technology,
    description: 'Backend development and server technologies',
    color: 'blue',
    tags: ['backend', 'server', 'api', 'database'],
  },
  {
    key: TopicEnum.Mobile,
    label: 'Mobile',
    icon: '📱',
    category: TopicCategory.Technology,
    description: 'Mobile app development and mobile technologies',
    color: 'blue',
    tags: ['mobile', 'ios', 'android', 'app-development'],
  },
  {
    key: TopicEnum.Database,
    label: 'Database',
    icon: '🗄️',
    category: TopicCategory.Technology,
    description: 'Database technologies and data management',
    color: 'blue',
    tags: ['database', 'sql', 'nosql', 'data'],
  },
  {
    key: TopicEnum.DevOps,
    label: 'DevOps',
    icon: '🔧',
    category: TopicCategory.Technology,
    description: 'DevOps practices and tools',
    color: 'blue',
    tags: ['devops', 'ci-cd', 'deployment', 'automation'],
  },
  {
    key: TopicEnum.Security,
    label: 'Security',
    icon: '🔒',
    category: TopicCategory.Technology,
    description: 'Cybersecurity and information security',
    color: 'red',
    tags: ['security', 'cybersecurity', 'privacy', 'hacking'],
  },
  {
    key: TopicEnum.Blockchain,
    label: 'Blockchain',
    icon: '⛓️',
    category: TopicCategory.Technology,
    description: 'Blockchain technology and distributed systems',
    color: 'purple',
    tags: ['blockchain', 'distributed-ledger', 'web3'],
  },
  {
    key: TopicEnum.OpenSource,
    label: 'Open Source',
    icon: '📦',
    category: TopicCategory.Technology,
    description: 'Open source projects and communities',
    color: 'green',
    tags: ['open-source', 'github', 'community', 'collaboration'],
  },

  // Entertainment
  {
    key: TopicEnum.Entertainment,
    label: 'Entertainment',
    icon: '🎬',
    category: TopicCategory.Entertainment,
    description: 'Entertainment industry news and trends',
    color: 'purple',
    tags: ['entertainment', 'movies', 'tv', 'music', 'celebrity'],
  },
  {
    key: TopicEnum.Memes,
    label: 'Memes',
    icon: '😂',
    category: TopicCategory.Entertainment,
    description: 'Viral memes and internet culture',
    color: 'yellow',
    tags: ['memes', 'viral', 'internet-culture', 'humor'],
  },

  // Finance
  {
    key: TopicEnum.Finance,
    label: 'Finance',
    icon: '💰',
    category: TopicCategory.Finance,
    description: 'Financial markets and economic news',
    color: 'green',
    tags: ['finance', 'markets', 'economy', 'investment'],
  },
  {
    key: TopicEnum.Business,
    label: 'Business',
    icon: '💼',
    category: TopicCategory.Finance,
    description: 'Business news and corporate developments',
    color: 'blue',
    tags: ['business', 'corporate', 'startups', 'entrepreneurship'],
  },
  {
    key: TopicEnum.Startups,
    label: 'Startups',
    icon: '🚀',
    category: TopicCategory.Finance,
    description: 'Startup ecosystem and entrepreneurship',
    color: 'orange',
    tags: ['startups', 'entrepreneurship', 'innovation', 'funding'],
  },
  {
    key: TopicEnum.Products,
    label: 'Products',
    icon: '📱',
    category: TopicCategory.Finance,
    description: 'Product launches and reviews',
    color: 'blue',
    tags: ['products', 'launches', 'reviews', 'innovation'],
  },

  // Gaming
  {
    key: TopicEnum.Gaming,
    label: 'Gaming',
    icon: '🎮',
    category: TopicCategory.Gaming,
    description: 'Video games and gaming industry',
    color: 'purple',
    tags: ['gaming', 'video-games', 'esports', 'streaming'],
  },
  {
    key: TopicEnum.FPS,
    label: 'FPS',
    icon: '🎯',
    category: TopicCategory.Gaming,
    description: 'First-person shooter games',
    color: 'red',
    tags: ['fps', 'shooter', 'action', 'gaming'],
  },
  {
    key: TopicEnum.MOBA,
    label: 'MOBA',
    icon: '⚔️',
    category: TopicCategory.Gaming,
    description: 'Multiplayer online battle arena games',
    color: 'blue',
    tags: ['moba', 'strategy', 'multiplayer', 'gaming'],
  },
  {
    key: TopicEnum.BattleRoyale,
    label: 'Battle Royale',
    icon: '🏆',
    category: TopicCategory.Gaming,
    description: 'Battle royale games',
    color: 'orange',
    tags: ['battle-royale', 'survival', 'multiplayer', 'gaming'],
  },
  {
    key: TopicEnum.Sandbox,
    label: 'Sandbox',
    icon: '🏗️',
    category: TopicCategory.Gaming,
    description: 'Sandbox and creative games',
    color: 'green',
    tags: ['sandbox', 'creative', 'building', 'gaming'],
  },
  {
    key: TopicEnum.RPG,
    label: 'RPG',
    icon: '⚔️',
    category: TopicCategory.Gaming,
    description: 'Role-playing games',
    color: 'purple',
    tags: ['rpg', 'role-playing', 'story', 'gaming'],
  },
  {
    key: TopicEnum.Strategy,
    label: 'Strategy',
    icon: '🧠',
    category: TopicCategory.Gaming,
    description: 'Strategy games',
    color: 'blue',
    tags: ['strategy', 'tactics', 'planning', 'gaming'],
  },
  {
    key: TopicEnum.Simulation,
    label: 'Simulation',
    icon: '🎮',
    category: TopicCategory.Gaming,
    description: 'Simulation games',
    color: 'green',
    tags: ['simulation', 'realistic', 'gaming'],
  },

  // News
  {
    key: TopicEnum.News,
    label: 'News',
    icon: '📰',
    category: TopicCategory.News,
    description: 'Breaking news and current events',
    color: 'blue',
    tags: ['news', 'current-events', 'breaking-news'],
  },
  {
    key: TopicEnum.World,
    label: 'World',
    icon: '🌍',
    category: TopicCategory.News,
    description: 'World news and international events',
    color: 'green',
    tags: ['world', 'international', 'global', 'news'],
  },
  {
    key: TopicEnum.Politics,
    label: 'Politics',
    icon: '🗳️',
    category: TopicCategory.Politics,
    description: 'Political news and government',
    color: 'red',
    tags: ['politics', 'government', 'elections', 'policy'],
  },
  {
    key: TopicEnum.Environment,
    label: 'Environment',
    icon: '🌍',
    category: TopicCategory.News,
    description: 'Environmental news and climate change',
    color: 'green',
    tags: ['environment', 'climate', 'sustainability', 'nature'],
  },
  {
    key: TopicEnum.Health,
    label: 'Health',
    icon: '🏥',
    category: TopicCategory.News,
    description: 'Health and medical news',
    color: 'red',
    tags: ['health', 'medical', 'wellness', 'medicine'],
  },

  // Crypto
  {
    key: TopicEnum.Crypto,
    label: 'Crypto',
    icon: '₿',
    category: TopicCategory.Crypto,
    description: 'Cryptocurrency news and trends',
    color: 'yellow',
    tags: ['crypto', 'bitcoin', 'cryptocurrency', 'digital-currency'],
  },
  {
    key: TopicEnum.Cryptocurrency,
    label: 'Cryptocurrency',
    icon: '₿',
    category: TopicCategory.Crypto,
    description: 'Cryptocurrency markets and developments',
    color: 'yellow',
    tags: ['cryptocurrency', 'crypto', 'trading', 'blockchain'],
  },
  {
    key: TopicEnum.DeFi,
    label: 'DeFi',
    icon: '🏦',
    category: TopicCategory.Crypto,
    description: 'Decentralized finance protocols',
    color: 'blue',
    tags: ['defi', 'decentralized-finance', 'yield-farming', 'crypto'],
  },
  {
    key: TopicEnum.MemeCoins,
    label: 'Meme Coins',
    icon: '🐕',
    category: TopicCategory.Crypto,
    description: 'Meme-based cryptocurrencies',
    color: 'yellow',
    tags: ['meme-coins', 'dogecoin', 'shiba', 'crypto'],
  },
  {
    key: TopicEnum.MajorCrypto,
    label: 'Major Crypto',
    icon: '₿',
    category: TopicCategory.Crypto,
    description: 'Major cryptocurrencies like Bitcoin and Ethereum',
    color: 'yellow',
    tags: ['bitcoin', 'ethereum', 'major-crypto', 'crypto'],
  },
  {
    key: TopicEnum.Trending,
    label: 'Trending',
    icon: '📈',
    category: TopicCategory.Crypto,
    description: 'Trending cryptocurrencies',
    color: 'green',
    tags: ['trending', 'gaining', 'crypto', 'markets'],
  },
  {
    key: TopicEnum.Declining,
    label: 'Declining',
    icon: '📉',
    category: TopicCategory.Crypto,
    description: 'Declining cryptocurrencies',
    color: 'red',
    tags: ['declining', 'losing', 'crypto', 'markets'],
  },

  // Lifestyle
  {
    key: TopicEnum.Lifestyle,
    label: 'Lifestyle',
    icon: '🏠',
    category: TopicCategory.Lifestyle,
    description: 'Lifestyle and personal development',
    color: 'pink',
    tags: ['lifestyle', 'personal-development', 'wellness', 'life'],
  },
  {
    key: TopicEnum.Culture,
    label: 'Culture',
    icon: '🎭',
    category: TopicCategory.Lifestyle,
    description: 'Cultural trends and social movements',
    color: 'purple',
    tags: ['culture', 'society', 'trends', 'social'],
  },
  {
    key: TopicEnum.SocialMedia,
    label: 'Social Media',
    icon: '📱',
    category: TopicCategory.Lifestyle,
    description: 'Social media trends and platforms',
    color: 'blue',
    tags: ['social-media', 'platforms', 'trends', 'viral'],
  },

  // Sports
  {
    key: TopicEnum.Sports,
    label: 'Sports',
    icon: '⚽',
    category: TopicCategory.Sports,
    description: 'Sports news and athletic events',
    color: 'green',
    tags: ['sports', 'athletics', 'competition', 'fitness'],
  },
]

export const getTopicKeys = (): TopicEnum[] => {
  return TOPICS.map((topic) => topic.key)
}

export const getTopicLabels = (): string[] => {
  return TOPICS.map((topic) => topic.label)
}

export const getTopicIcons = (): { [key: string]: string } => {
  const icons: { [key: string]: string } = {}
  TOPICS.forEach((topic) => {
    icons[topic.key] = topic.icon
  })
  return icons
}

// Topic categories
export const TOPIC_CATEGORIES = {
  [TopicCategory.General]: 'General',
  [TopicCategory.Technology]: 'Technology',
  [TopicCategory.Entertainment]: 'Entertainment',
  [TopicCategory.Finance]: 'Finance',
  [TopicCategory.Gaming]: 'Gaming',
  [TopicCategory.News]: 'News',
  [TopicCategory.Crypto]: 'Cryptocurrency',
  [TopicCategory.Lifestyle]: 'Lifestyle',
  [TopicCategory.Sports]: 'Sports',
  [TopicCategory.Politics]: 'Politics',
} as const

// Topic colors
export const TOPIC_COLORS = {
  [TopicCategory.General]: 'gray',
  [TopicCategory.Technology]: 'blue',
  [TopicCategory.Entertainment]: 'purple',
  [TopicCategory.Finance]: 'green',
  [TopicCategory.Gaming]: 'purple',
  [TopicCategory.News]: 'blue',
  [TopicCategory.Crypto]: 'yellow',
  [TopicCategory.Lifestyle]: 'pink',
  [TopicCategory.Sports]: 'green',
  [TopicCategory.Politics]: 'red',
} as const
