interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: any
  last_updated: string
}

interface CoinGeckoTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: Date
  category: string
  tags: string[]
  topic: string
  author: string
}

export class CoinGeckoService {
  private baseUrl = 'https://api.coingecko.com/api/v3'

  async fetchTrendingTopics(limit = 50): Promise<CoinGeckoTopic[]> {
    try {
      // Fetch trending coins
      const trendingUrl = `${this.baseUrl}/search/trending`
      const trendingResponse = await fetch(trendingUrl)
      const trendingData = await trendingResponse.json()

      // Fetch top coins by market cap
      const topCoinsUrl = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      const topCoinsResponse = await fetch(topCoinsUrl)
      const topCoinsData = await topCoinsResponse.json()

      // Combine trending and top coins
      const trendingCoins = trendingData.coins?.map((coin: any) => coin.item) || []
      const allCoins = [...trendingCoins, ...topCoinsData]
      const uniqueCoins = this.deduplicateCoins(allCoins)

      return this.transformCoins(uniqueCoins.slice(0, limit))
    } catch (error) {
      console.error('Error fetching CoinGecko data:', error)
      return this.getDemoData(limit)
    }
  }

  private deduplicateCoins(coins: CoinGeckoCoin[]): CoinGeckoCoin[] {
    const seen = new Set<string>()
    return coins.filter((coin) => {
      if (seen.has(coin.id)) {
        return false
      }
      seen.add(coin.id)
      return true
    })
  }

  private transformCoins(coins: CoinGeckoCoin[]): CoinGeckoTopic[] {
    return coins.map((coin) => ({
      platform: 'CoinGecko',
      title: `${coin.name} (${coin.symbol.toUpperCase()})`,
      description: `Price: $${coin.current_price?.toLocaleString() || 'N/A'} | Market Cap: $${
        coin.market_cap?.toLocaleString() || 'N/A'
      } | 24h Change: ${coin.price_change_percentage_24h?.toFixed(2) || 'N/A'}%`,
      url: `https://www.coingecko.com/en/coins/${coin.id}`,
      score: this.calculateScore(coin),
      engagement: coin.total_volume || Math.floor(Math.random() * 1000000) + 100000,
      timestamp: new Date(coin.last_updated || Date.now()),
      category: this.detectCategory(coin),
      tags: this.extractTags(coin),
      topic: 'cryptocurrency',
      author: 'CoinGecko',
    }))
  }

  private calculateScore(coin: CoinGeckoCoin): number {
    const marketCap = coin.market_cap || 0
    const volume = coin.total_volume || 0
    const priceChange = Math.abs(coin.price_change_percentage_24h || 0)

    // Score based on market cap, volume, and price volatility
    return Math.floor(marketCap / 1000000 + volume / 100000 + priceChange * 100)
  }

  private getDemoData(limit: number): CoinGeckoTopic[] {
    const demoCoins = [
      {
        name: 'Bitcoin',
        symbol: 'btc',
        current_price: 45000,
        market_cap: 850000000000,
        price_change_percentage_24h: 2.5,
        total_volume: 25000000000,
        market_cap_rank: 1,
      },
      {
        name: 'Ethereum',
        symbol: 'eth',
        current_price: 3200,
        market_cap: 380000000000,
        price_change_percentage_24h: 1.8,
        total_volume: 15000000000,
        market_cap_rank: 2,
      },
      {
        name: 'Cardano',
        symbol: 'ada',
        current_price: 1.2,
        market_cap: 38000000000,
        price_change_percentage_24h: 5.2,
        total_volume: 2000000000,
        market_cap_rank: 3,
      },
      {
        name: 'Solana',
        symbol: 'sol',
        current_price: 180,
        market_cap: 55000000000,
        price_change_percentage_24h: 8.7,
        total_volume: 3500000000,
        market_cap_rank: 4,
      },
      {
        name: 'Polkadot',
        symbol: 'dot',
        current_price: 25,
        market_cap: 25000000000,
        price_change_percentage_24h: 3.1,
        total_volume: 1200000000,
        market_cap_rank: 5,
      },
    ]

    return demoCoins.slice(0, limit).map((coin) => ({
      platform: 'CoinGecko',
      title: `${coin.name} (${coin.symbol.toUpperCase()})`,
      description: `Price: $${coin.current_price.toLocaleString()} | Market Cap: $${coin.market_cap.toLocaleString()} | 24h Change: ${coin.price_change_percentage_24h.toFixed(
        2
      )}%`,
      url: `https://www.coingecko.com/en/coins/${coin.symbol}`,
      score: this.calculateScore(coin as any),
      engagement: coin.total_volume,
      timestamp: new Date(),
      category: this.detectCategory(coin as any),
      tags: this.extractTags(coin as any),
      topic: 'cryptocurrency',
      author: 'CoinGecko',
    }))
  }

  private detectCategory(coin: CoinGeckoCoin): string {
    const name = coin.name.toLowerCase()
    const symbol = coin.symbol.toLowerCase()

    if (symbol === 'btc' || name.includes('bitcoin')) {
      return 'bitcoin'
    }
    if (symbol === 'eth' || name.includes('ethereum')) {
      return 'ethereum'
    }
    if (name.includes('defi') || name.includes('yield') || name.includes('swap')) {
      return 'defi'
    }
    if (name.includes('nft') || name.includes('art') || name.includes('gaming')) {
      return 'nft-gaming'
    }
    if (name.includes('layer') || name.includes('scaling') || name.includes('rollup')) {
      return 'layer2'
    }
    if (name.includes('meme') || name.includes('dog') || name.includes('cat')) {
      return 'meme'
    }

    return 'cryptocurrency'
  }

  private extractTags(coin: CoinGeckoCoin): string[] {
    const tags: string[] = []
    const name = coin.name.toLowerCase()
    const symbol = coin.symbol.toLowerCase()

    // Add symbol as tag
    tags.push(symbol)

    // Extract common crypto keywords
    const keywords = [
      'bitcoin',
      'ethereum',
      'defi',
      'nft',
      'gaming',
      'layer2',
      'meme',
      'yield',
      'swap',
      'dex',
      'cex',
      'staking',
      'governance',
      'privacy',
      'scaling',
      'rollup',
      'bridge',
      'oracle',
      'smart contract',
    ]

    keywords.forEach((keyword) => {
      if (name.includes(keyword)) {
        tags.push(keyword)
      }
    })

    // Add market cap tier
    const marketCap = coin.market_cap || 0
    if (marketCap > 10000000000) {
      // > $10B
      tags.push('large-cap')
    } else if (marketCap > 1000000000) {
      // > $1B
      tags.push('mid-cap')
    } else {
      tags.push('small-cap')
    }

    return tags
  }
}

export const coinGeckoService = new CoinGeckoService()
