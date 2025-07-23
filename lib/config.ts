// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: 'https://ewlwqxfzctmwczluhulz.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3bHdxeGZ6Y3Rtd2N6bHVodWx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMTI0MjgsImV4cCI6MjA2ODc4ODQyOH0.6UVM0RzY4E4rR3KiQ44rbOBDUjUoY0bRkkphsg7-58s',
}

// Reddit Configuration
export const REDDIT_CONFIG = {
  clientId: process.env.REDDIT_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  userAgent: process.env.REDDIT_USER_AGENT || 'viral_trending_bot/1.0',
}

// YouTube Configuration
export const YOUTUBE_CONFIG = {
  apiKey: process.env.YOUTUBE_API_KEY || '',
}

// GitHub Configuration (no auth needed, just implementation)
export const GITHUB_CONFIG = {
  enabled: true,
}

// GNews Configuration
export const GNEWS_CONFIG = {
  apiKey: process.env.GNEWS_API_KEY || '',
}

// Product Hunt Configuration
export const PRODUCT_HUNT_CONFIG = {
  accessToken: process.env.PRODUCT_HUNT_ACCESS_TOKEN || '',
}

// Twitch Configuration
export const TWITCH_CONFIG = {
  clientId: process.env.TWITCH_CLIENT_ID || '',
  clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
}

// Mastodon Configuration
export const MASTODON_CONFIG = {
  accessToken: process.env.MASTODON_ACCESS_TOKEN || '',
  instance: process.env.MASTODON_INSTANCE || 'mastodon.social',
}
