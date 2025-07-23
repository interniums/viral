import Image from 'next/image'
import { Platform } from '@/lib/constants/enums'
import { PlatformIconProps } from '@/types'

export default function PlatformIcon({ platform, size = 24, className = '' }: PlatformIconProps) {
  const getIconPath = (platform: Platform): string => {
    switch (platform) {
      case Platform.Reddit:
        return '/images/platforms/reddit-logo.svg'
      case Platform.YouTube:
        return '/images/platforms/youtube-logo.svg'
      case Platform.GoogleTrends:
        return '/images/platforms/google-trends-icon.svg'
      case Platform.HackerNews:
        return '/images/platforms/hackernews-logo.svg'
      case Platform.GitHub:
        return '/images/platforms/github-logo.svg'
      case Platform.StackOverflow:
        return '/images/platforms/stackoverflow-logo.svg'
      case Platform.ProductHunt:
        return '/images/platforms/producthunt-logo.svg'
      case Platform.Twitch:
        return '/images/platforms/twitch-logo.svg'
      case Platform.Mastodon:
        return '/images/platforms/joinmastodon-logo.svg'
      case Platform.GNews:
        return '/images/platforms/gnews-logo.svg'
      case Platform.CoinGecko:
        return '/images/platforms/coingecko-logo.svg'
      case Platform.DevTo:
        return '/images/platforms/devto-logo.svg'
      case Platform.Steam:
        return '/images/platforms/steam-logo.svg'
      case Platform.TheGuardian:
        return '/images/platforms/the-guardian-logo.svg'
      case Platform.Binance:
        return '/images/platforms/binance-logo.svg'
      default:
        return '/images/platforms/default-logo.svg'
    }
  }

  return <Image src={getIconPath(platform)} alt={`${platform} logo`} width={size} height={size} className={className} />
}
