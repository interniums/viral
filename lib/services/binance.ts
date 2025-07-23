interface BinanceTicker {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

interface BinanceTopic {
  platform: string
  title: string
  description: string
  url: string
  score: number
  engagement: number
  timestamp: string
  category: string
  tags: string[]
  topic: string
  author: string
}

export class BinanceService {
  private baseUrl = 'https://api.binance.com/api/v3'

  async fetchTrendingTopics(limit = 50): Promise<BinanceTopic[]> {
    try {
      const [tickers, topGainers, topLosers] = await Promise.all([
        this.fetch24hrTickers(),
        this.fetchTopGainers(),
        this.fetchTopLosers(),
      ])

      // Combine and process data
      const allTickers = this.deduplicateTickers([...tickers, ...topGainers, ...topLosers])

      // Transform to our standard format
      const topics = this.transformTickers(allTickers.slice(0, limit))

      return topics
    } catch (error) {
      console.error('Error fetching Binance data:', error)
      return this.getDemoData(limit)
    }
  }

  private async fetch24hrTickers(): Promise<BinanceTicker[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr`)
      const data = await response.json()

      // Filter for USDT pairs and sort by volume
      return data
        .filter((ticker: BinanceTicker) => ticker.symbol.endsWith('USDT'))
        .sort((a: BinanceTicker, b: BinanceTicker) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, 20)
    } catch (error) {
      console.error('Error fetching 24hr tickers:', error)
      return []
    }
  }

  private async fetchTopGainers(): Promise<BinanceTicker[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr`)
      const data = await response.json()

      // Filter for USDT pairs and sort by price change percentage
      return data
        .filter((ticker: BinanceTicker) => ticker.symbol.endsWith('USDT'))
        .sort(
          (a: BinanceTicker, b: BinanceTicker) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        )
        .slice(0, 10)
    } catch (error) {
      console.error('Error fetching top gainers:', error)
      return []
    }
  }

  private async fetchTopLosers(): Promise<BinanceTicker[]> {
    try {
      const response = await fetch(`${this.baseUrl}/ticker/24hr`)
      const data = await response.json()

      // Filter for USDT pairs and sort by price change percentage (ascending)
      return data
        .filter((ticker: BinanceTicker) => ticker.symbol.endsWith('USDT'))
        .sort(
          (a: BinanceTicker, b: BinanceTicker) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
        )
        .slice(0, 10)
    } catch (error) {
      console.error('Error fetching top losers:', error)
      return []
    }
  }

  private deduplicateTickers(tickers: BinanceTicker[]): BinanceTicker[] {
    const seen = new Set()
    return tickers.filter((ticker) => {
      if (seen.has(ticker.symbol)) {
        return false
      }
      seen.add(ticker.symbol)
      return true
    })
  }

  private transformTickers(tickers: BinanceTicker[]): BinanceTopic[] {
    return tickers.map((ticker) => ({
      platform: 'Binance',
      title: `${ticker.symbol} - ${parseFloat(ticker.priceChangePercent).toFixed(2)}%`,
      description: `${ticker.symbol} is trading at $${parseFloat(ticker.lastPrice).toFixed(
        4
      )} with 24h volume of $${this.formatVolume(ticker.quoteVolume)}`,
      url: `https://www.binance.com/en/trade/${ticker.symbol}`,
      score: this.calculateScore(ticker),
      engagement: this.calculateEngagement(ticker),
      timestamp: new Date().toISOString(),
      category: this.detectCategory(ticker),
      tags: this.extractTags(ticker),
      topic: 'cryptocurrency',
      author: 'Binance Market Data',
    }))
  }

  private calculateScore(ticker: BinanceTicker): number {
    let score = 50 // Base score

    const priceChangePercent = Math.abs(parseFloat(ticker.priceChangePercent))
    const volume = parseFloat(ticker.quoteVolume)

    // Score based on price movement
    if (priceChangePercent > 10) {
      score += 30
    } else if (priceChangePercent > 5) {
      score += 20
    } else if (priceChangePercent > 2) {
      score += 10
    }

    // Score based on volume
    if (volume > 1000000000) {
      // > $1B
      score += 20
    } else if (volume > 100000000) {
      // > $100M
      score += 15
    } else if (volume > 10000000) {
      // > $10M
      score += 10
    }

    return Math.min(score, 100)
  }

  private calculateEngagement(ticker: BinanceTicker): number {
    const volume = parseFloat(ticker.quoteVolume)
    const priceChangePercent = Math.abs(parseFloat(ticker.priceChangePercent))

    // Base engagement on volume and price movement
    let engagement = volume / 1000000 // Convert to millions

    // Boost for significant price movements
    if (priceChangePercent > 20) {
      engagement *= 3
    } else if (priceChangePercent > 10) {
      engagement *= 2
    } else if (priceChangePercent > 5) {
      engagement *= 1.5
    }

    return Math.round(engagement)
  }

  private detectCategory(ticker: BinanceTicker): string {
    const symbol = ticker.symbol.toLowerCase()
    const priceChangePercent = parseFloat(ticker.priceChangePercent)

    if (symbol.includes('btc') || symbol.includes('eth')) {
      return 'major-crypto'
    }
    if (symbol.includes('defi') || symbol.includes('uni') || symbol.includes('aave')) {
      return 'defi'
    }
    if (symbol.includes('meme') || symbol.includes('doge') || symbol.includes('shib')) {
      return 'meme-coins'
    }
    if (priceChangePercent > 10) {
      return 'trending'
    }
    if (priceChangePercent < -10) {
      return 'declining'
    }

    return 'cryptocurrency'
  }

  private extractTags(ticker: BinanceTicker): string[] {
    const tags: string[] = ['crypto', 'binance', 'trading']
    const symbol = ticker.symbol.toLowerCase()
    const priceChangePercent = parseFloat(ticker.priceChangePercent)

    // Add base currency tag
    const baseCurrency = symbol.replace('usdt', '').toLowerCase()
    tags.push(baseCurrency)

    // Add movement tags
    if (priceChangePercent > 10) {
      tags.push('bullish', 'trending')
    } else if (priceChangePercent < -10) {
      tags.push('bearish', 'declining')
    } else if (priceChangePercent > 0) {
      tags.push('gaining')
    } else {
      tags.push('losing')
    }

    // Add special tags
    if (symbol.includes('btc')) {
      tags.push('bitcoin', 'btc')
    }
    if (symbol.includes('eth')) {
      tags.push('ethereum', 'eth')
    }
    if (symbol.includes('defi')) {
      tags.push('defi')
    }

    return tags.slice(0, 6) // Limit to 6 tags
  }

  private formatVolume(volume: string): string {
    const vol = parseFloat(volume)
    if (vol >= 1000000000) {
      return `${(vol / 1000000000).toFixed(2)}B`
    } else if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(2)}M`
    } else if (vol >= 1000) {
      return `${(vol / 1000).toFixed(2)}K`
    }
    return vol.toFixed(2)
  }

  private getDemoData(limit: number): BinanceTopic[] {
    const demoTickers = [
      {
        symbol: 'BTCUSDT',
        priceChangePercent: '5.23',
        lastPrice: '43250.50',
        quoteVolume: '2500000000',
        category: 'major-crypto',
        tags: ['bitcoin', 'btc', 'bullish', 'trending'],
      },
      {
        symbol: 'ETHUSDT',
        priceChangePercent: '3.87',
        lastPrice: '2650.75',
        quoteVolume: '1800000000',
        category: 'major-crypto',
        tags: ['ethereum', 'eth', 'gaining'],
      },
      {
        symbol: 'DOGEUSDT',
        priceChangePercent: '15.67',
        lastPrice: '0.085',
        quoteVolume: '850000000',
        category: 'meme-coins',
        tags: ['doge', 'meme-coins', 'bullish', 'trending'],
      },
      {
        symbol: 'UNIUSDT',
        priceChangePercent: '8.92',
        lastPrice: '12.45',
        quoteVolume: '320000000',
        category: 'defi',
        tags: ['uniswap', 'defi', 'bullish'],
      },
      {
        symbol: 'ADAUSDT',
        priceChangePercent: '-4.56',
        lastPrice: '0.485',
        quoteVolume: '280000000',
        category: 'cryptocurrency',
        tags: ['cardano', 'ada', 'bearish'],
      },
    ]

    return demoTickers.slice(0, limit).map((ticker, index) => ({
      platform: 'Binance',
      title: `${ticker.symbol} - ${ticker.priceChangePercent}%`,
      description: `${ticker.symbol} is trading at $${ticker.lastPrice} with 24h volume of $${this.formatVolume(
        ticker.quoteVolume
      )}`,
      url: `https://www.binance.com/en/trade/${ticker.symbol}`,
      score: Math.round(100 - index * 15),
      engagement: parseInt(ticker.quoteVolume) / 1000000,
      timestamp: new Date().toISOString(),
      category: ticker.category,
      tags: ticker.tags,
      topic: 'cryptocurrency',
      author: 'Binance Market Data',
    }))
  }
}

export const binanceService = new BinanceService()
