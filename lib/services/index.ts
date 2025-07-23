import { dataFetcherService } from './dataFetcher'
import { redditService } from './reddit'
import { youtubeService } from './youtube'
import { googleTrendsService } from './googleTrends'
import { hackerNewsService } from './hackerNews'
import { githubTrendingService } from './githubTrending'
import { stackOverflowService } from './stackOverflow'
import { productHuntService } from './productHunt'
import { twitchService } from './twitch'
import { mastodonService } from './mastodon'
import { gnewsService } from './gnews'
import { coinGeckoService } from './coingecko'
import { devToService } from './devto'
import { steamService } from './steam'
import { guardianService } from './guardian'
import { binanceService } from './binance'

// Register all services with the DataFetcherService
dataFetcherService.setServices({
  redditService,
  youtubeService,
  googleTrendsService,
  hackerNewsService,
  githubTrendingService,
  stackOverflowService,
  productHuntService,
  twitchService,
  mastodonService,
  gnewsService,
  coinGeckoService,
  devToService,
  steamService,
  guardianService,
  binanceService,
})

export {
  dataFetcherService,
  redditService,
  youtubeService,
  googleTrendsService,
  hackerNewsService,
  githubTrendingService,
  stackOverflowService,
  productHuntService,
  twitchService,
  mastodonService,
  gnewsService,
  coinGeckoService,
  devToService,
  steamService,
  guardianService,
  binanceService,
}
