import { Platform, Topic } from '../constants/enums'

export class BaseService {
  protected getPlatformEnum(platformName: string): Platform {
    switch (platformName.toLowerCase()) {
      case 'reddit':
        return Platform.Reddit
      case 'youtube':
        return Platform.YouTube
      case 'google trends':
        return Platform.GoogleTrends
      case 'hacker news':
        return Platform.HackerNews
      case 'github':
        return Platform.GitHub
      case 'stack overflow':
        return Platform.StackOverflow
      case 'product hunt':
        return Platform.ProductHunt
      case 'twitch':
        return Platform.Twitch
      case 'mastodon':
        return Platform.Mastodon
      case 'gnews':
        return Platform.GNews
      case 'coingecko':
        return Platform.CoinGecko
      case 'dev.to':
        return Platform.DevTo
      case 'steam':
        return Platform.Steam
      case 'the guardian':
        return Platform.TheGuardian
      case 'binance':
        return Platform.Binance
      default:
        throw new Error(`Unknown platform: ${platformName}`)
    }
  }

  protected getTopicEnum(topicName: string): Topic {
    switch (topicName.toLowerCase()) {
      case 'general':
        return Topic.General
      case 'technology':
        return Topic.Technology
      case 'programming':
        return Topic.Programming
      case 'artificial-intelligence':
      case 'ai':
        return Topic.AI
      case 'frontend':
        return Topic.Frontend
      case 'backend':
        return Topic.Backend
      case 'mobile':
        return Topic.Mobile
      case 'database':
        return Topic.Database
      case 'devops':
        return Topic.DevOps
      case 'security':
        return Topic.Security
      case 'blockchain':
        return Topic.Blockchain
      case 'open-source':
        return Topic.OpenSource
      case 'entertainment':
        return Topic.Entertainment
      case 'memes':
        return Topic.Memes
      case 'finance':
        return Topic.Finance
      case 'business':
        return Topic.Business
      case 'startups':
        return Topic.Startups
      case 'products':
        return Topic.Products
      case 'gaming':
        return Topic.Gaming
      case 'fps':
        return Topic.FPS
      case 'moba':
        return Topic.MOBA
      case 'battle-royale':
        return Topic.BattleRoyale
      case 'sandbox':
        return Topic.Sandbox
      case 'rpg':
        return Topic.RPG
      case 'strategy':
        return Topic.Strategy
      case 'simulation':
        return Topic.Simulation
      case 'news':
        return Topic.News
      case 'world':
        return Topic.World
      case 'politics':
        return Topic.Politics
      case 'environment':
        return Topic.Environment
      case 'health':
        return Topic.Health
      case 'crypto':
      case 'cryptocurrency':
        return Topic.Cryptocurrency
      case 'defi':
        return Topic.DeFi
      case 'meme-coins':
        return Topic.MemeCoins
      case 'major-crypto':
        return Topic.MajorCrypto
      case 'trending':
        return Topic.Trending
      case 'declining':
        return Topic.Declining
      case 'lifestyle':
        return Topic.Lifestyle
      case 'culture':
        return Topic.Culture
      case 'social-media':
        return Topic.SocialMedia
      case 'sports':
        return Topic.Sports
      default:
        return Topic.General
    }
  }
}
