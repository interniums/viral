export interface Topic {
  key: string
  label: string
  icon: string
  category:
    | 'general'
    | 'technology'
    | 'entertainment'
    | 'finance'
    | 'gaming'
    | 'news'
    | 'crypto'
    | 'lifestyle'
    | 'sports'
    | 'politics'
  description: string
  color: string
  tags: string[]
}

export const TOPICS: Topic[] = [
  // General
  {
    key: 'general',
    label: 'General',
    icon: '🌐',
    category: 'general',
    description: 'General trending topics and discussions',
    color: 'gray',
    tags: ['general', 'trending', 'popular'],
  },

  // Technology
  {
    key: 'technology',
    label: 'Technology',
    icon: '💻',
    category: 'technology',
    description: 'Technology news, innovations, and developments',
    color: 'blue',
    tags: ['tech', 'innovation', 'software', 'hardware'],
  },
  {
    key: 'programming',
    label: 'Programming',
    icon: '👨‍💻',
    category: 'technology',
    description: 'Programming languages, frameworks, and development',
    color: 'blue',
    tags: ['coding', 'development', 'software', 'programming'],
  },
  {
    key: 'artificial-intelligence',
    label: 'AI & ML',
    icon: '🤖',
    category: 'technology',
    description: 'Artificial intelligence and machine learning',
    color: 'purple',
    tags: ['ai', 'ml', 'machine-learning', 'neural-networks'],
  },
  {
    key: 'ai',
    label: 'AI',
    icon: '🤖',
    category: 'technology',
    description: 'Artificial intelligence developments',
    color: 'purple',
    tags: ['artificial-intelligence', 'ai', 'automation'],
  },
  {
    key: 'frontend',
    label: 'Frontend',
    icon: '🎨',
    category: 'technology',
    description: 'Frontend development and web technologies',
    color: 'blue',
    tags: ['frontend', 'web', 'ui', 'ux', 'react', 'vue', 'angular'],
  },
  {
    key: 'backend',
    label: 'Backend',
    icon: '⚙️',
    category: 'technology',
    description: 'Backend development and server technologies',
    color: 'blue',
    tags: ['backend', 'server', 'api', 'database'],
  },
  {
    key: 'mobile',
    label: 'Mobile',
    icon: '📱',
    category: 'technology',
    description: 'Mobile app development and mobile technologies',
    color: 'blue',
    tags: ['mobile', 'ios', 'android', 'app-development'],
  },
  {
    key: 'database',
    label: 'Database',
    icon: '🗄️',
    category: 'technology',
    description: 'Database technologies and data management',
    color: 'blue',
    tags: ['database', 'sql', 'nosql', 'data'],
  },
  {
    key: 'devops',
    label: 'DevOps',
    icon: '🔧',
    category: 'technology',
    description: 'DevOps practices and tools',
    color: 'blue',
    tags: ['devops', 'ci-cd', 'deployment', 'automation'],
  },
  {
    key: 'security',
    label: 'Security',
    icon: '🔒',
    category: 'technology',
    description: 'Cybersecurity and information security',
    color: 'red',
    tags: ['security', 'cybersecurity', 'privacy', 'hacking'],
  },
  {
    key: 'blockchain',
    label: 'Blockchain',
    icon: '⛓️',
    category: 'technology',
    description: 'Blockchain technology and distributed systems',
    color: 'purple',
    tags: ['blockchain', 'distributed-ledger', 'web3'],
  },
  {
    key: 'open-source',
    label: 'Open Source',
    icon: '📦',
    category: 'technology',
    description: 'Open source projects and communities',
    color: 'green',
    tags: ['open-source', 'github', 'community', 'collaboration'],
  },

  // Entertainment
  {
    key: 'entertainment',
    label: 'Entertainment',
    icon: '🎬',
    category: 'entertainment',
    description: 'Entertainment industry news and trends',
    color: 'purple',
    tags: ['entertainment', 'movies', 'tv', 'music', 'celebrity'],
  },
  {
    key: 'memes',
    label: 'Memes',
    icon: '😂',
    category: 'entertainment',
    description: 'Viral memes and internet culture',
    color: 'yellow',
    tags: ['memes', 'viral', 'internet-culture', 'humor'],
  },

  // Finance
  {
    key: 'finance',
    label: 'Finance',
    icon: '💰',
    category: 'finance',
    description: 'Financial markets and economic news',
    color: 'green',
    tags: ['finance', 'markets', 'economy', 'investment'],
  },
  {
    key: 'business',
    label: 'Business',
    icon: '💼',
    category: 'finance',
    description: 'Business news and corporate developments',
    color: 'blue',
    tags: ['business', 'corporate', 'startups', 'entrepreneurship'],
  },
  {
    key: 'startups',
    label: 'Startups',
    icon: '🚀',
    category: 'finance',
    description: 'Startup ecosystem and entrepreneurship',
    color: 'orange',
    tags: ['startups', 'entrepreneurship', 'innovation', 'funding'],
  },
  {
    key: 'products',
    label: 'Products',
    icon: '📱',
    category: 'finance',
    description: 'Product launches and reviews',
    color: 'blue',
    tags: ['products', 'launches', 'reviews', 'innovation'],
  },

  // Gaming
  {
    key: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    category: 'gaming',
    description: 'Video games and gaming industry',
    color: 'purple',
    tags: ['gaming', 'video-games', 'esports', 'streaming'],
  },
  {
    key: 'fps',
    label: 'FPS',
    icon: '🎯',
    category: 'gaming',
    description: 'First-person shooter games',
    color: 'red',
    tags: ['fps', 'shooter', 'action', 'gaming'],
  },
  {
    key: 'moba',
    label: 'MOBA',
    icon: '⚔️',
    category: 'gaming',
    description: 'Multiplayer online battle arena games',
    color: 'blue',
    tags: ['moba', 'strategy', 'multiplayer', 'gaming'],
  },
  {
    key: 'battle-royale',
    label: 'Battle Royale',
    icon: '🏆',
    category: 'gaming',
    description: 'Battle royale games',
    color: 'orange',
    tags: ['battle-royale', 'survival', 'multiplayer', 'gaming'],
  },
  {
    key: 'sandbox',
    label: 'Sandbox',
    icon: '🏗️',
    category: 'gaming',
    description: 'Sandbox and creative games',
    color: 'green',
    tags: ['sandbox', 'creative', 'building', 'gaming'],
  },
  {
    key: 'rpg',
    label: 'RPG',
    icon: '⚔️',
    category: 'gaming',
    description: 'Role-playing games',
    color: 'purple',
    tags: ['rpg', 'role-playing', 'story', 'gaming'],
  },
  {
    key: 'strategy',
    label: 'Strategy',
    icon: '🧠',
    category: 'gaming',
    description: 'Strategy games',
    color: 'blue',
    tags: ['strategy', 'tactics', 'planning', 'gaming'],
  },
  {
    key: 'simulation',
    label: 'Simulation',
    icon: '🎮',
    category: 'gaming',
    description: 'Simulation games',
    color: 'green',
    tags: ['simulation', 'realistic', 'gaming'],
  },

  // News
  {
    key: 'news',
    label: 'News',
    icon: '📰',
    category: 'news',
    description: 'Breaking news and current events',
    color: 'blue',
    tags: ['news', 'current-events', 'breaking-news'],
  },
  {
    key: 'world',
    label: 'World',
    icon: '🌍',
    category: 'news',
    description: 'World news and international events',
    color: 'green',
    tags: ['world', 'international', 'global', 'news'],
  },
  {
    key: 'politics',
    label: 'Politics',
    icon: '🗳️',
    category: 'politics',
    description: 'Political news and government',
    color: 'red',
    tags: ['politics', 'government', 'elections', 'policy'],
  },
  {
    key: 'environment',
    label: 'Environment',
    icon: '🌍',
    category: 'news',
    description: 'Environmental news and climate change',
    color: 'green',
    tags: ['environment', 'climate', 'sustainability', 'nature'],
  },
  {
    key: 'health',
    label: 'Health',
    icon: '🏥',
    category: 'news',
    description: 'Health and medical news',
    color: 'red',
    tags: ['health', 'medical', 'wellness', 'medicine'],
  },

  // Crypto
  {
    key: 'crypto',
    label: 'Crypto',
    icon: '₿',
    category: 'crypto',
    description: 'Cryptocurrency news and trends',
    color: 'yellow',
    tags: ['crypto', 'bitcoin', 'cryptocurrency', 'digital-currency'],
  },
  {
    key: 'cryptocurrency',
    label: 'Cryptocurrency',
    icon: '₿',
    category: 'crypto',
    description: 'Cryptocurrency markets and developments',
    color: 'yellow',
    tags: ['cryptocurrency', 'crypto', 'trading', 'blockchain'],
  },
  {
    key: 'defi',
    label: 'DeFi',
    icon: '🏦',
    category: 'crypto',
    description: 'Decentralized finance protocols',
    color: 'blue',
    tags: ['defi', 'decentralized-finance', 'yield-farming', 'crypto'],
  },
  {
    key: 'meme-coins',
    label: 'Meme Coins',
    icon: '🐕',
    category: 'crypto',
    description: 'Meme-based cryptocurrencies',
    color: 'yellow',
    tags: ['meme-coins', 'dogecoin', 'shiba', 'crypto'],
  },
  {
    key: 'major-crypto',
    label: 'Major Crypto',
    icon: '₿',
    category: 'crypto',
    description: 'Major cryptocurrencies like Bitcoin and Ethereum',
    color: 'yellow',
    tags: ['bitcoin', 'ethereum', 'major-crypto', 'crypto'],
  },
  {
    key: 'trending',
    label: 'Trending',
    icon: '📈',
    category: 'crypto',
    description: 'Trending cryptocurrencies',
    color: 'green',
    tags: ['trending', 'gaining', 'crypto', 'markets'],
  },
  {
    key: 'declining',
    label: 'Declining',
    icon: '📉',
    category: 'crypto',
    description: 'Declining cryptocurrencies',
    color: 'red',
    tags: ['declining', 'losing', 'crypto', 'markets'],
  },

  // Lifestyle
  {
    key: 'lifestyle',
    label: 'Lifestyle',
    icon: '🏠',
    category: 'lifestyle',
    description: 'Lifestyle and personal development',
    color: 'pink',
    tags: ['lifestyle', 'personal-development', 'wellness', 'life'],
  },
  {
    key: 'culture',
    label: 'Culture',
    icon: '🎭',
    category: 'lifestyle',
    description: 'Cultural trends and social movements',
    color: 'purple',
    tags: ['culture', 'society', 'trends', 'social'],
  },
  {
    key: 'social-media',
    label: 'Social Media',
    icon: '📱',
    category: 'lifestyle',
    description: 'Social media trends and platforms',
    color: 'blue',
    tags: ['social-media', 'platforms', 'trends', 'viral'],
  },

  // Sports
  {
    key: 'sports',
    label: 'Sports',
    icon: '⚽',
    category: 'sports',
    description: 'Sports news and athletic events',
    color: 'green',
    tags: ['sports', 'athletics', 'competition', 'fitness'],
  },
]

// Helper functions
export const getTopicByKey = (key: string): Topic | undefined => {
  return TOPICS.find((topic) => topic.key === key)
}

export const getTopicsByCategory = (category: Topic['category']): Topic[] => {
  return TOPICS.filter((topic) => topic.category === category)
}

export const getTopicKeys = (): string[] => {
  return TOPICS.map((topic) => topic.key)
}

export const getTopicLabels = (): string[] => {
  return TOPICS.map((topic) => topic.label)
}

export const getTopicIcons = (): Record<string, string> => {
  const icons: Record<string, string> = {}
  TOPICS.forEach((topic) => {
    icons[topic.key] = topic.icon
  })
  return icons
}

// Topic categories
export const TOPIC_CATEGORIES = {
  general: 'General',
  technology: 'Technology',
  entertainment: 'Entertainment',
  finance: 'Finance',
  gaming: 'Gaming',
  news: 'News',
  crypto: 'Cryptocurrency',
  lifestyle: 'Lifestyle',
  sports: 'Sports',
  politics: 'Politics',
} as const

// Topic colors
export const TOPIC_COLORS = {
  general: 'gray',
  technology: 'blue',
  entertainment: 'purple',
  finance: 'green',
  gaming: 'purple',
  news: 'blue',
  crypto: 'yellow',
  lifestyle: 'pink',
  sports: 'green',
  politics: 'red',
} as const
