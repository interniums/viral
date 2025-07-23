interface TwitchStream {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: string
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tag_ids: string[]
}

interface TwitchGame {
  id: string
  name: string
  box_art_url: string
}

interface TwitchTopic {
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

export class TwitchService {
  private baseUrl = 'https://api.twitch.tv/helix'
  private clientId = process.env.TWITCH_CLIENT_ID
  private clientSecret = process.env.TWITCH_CLIENT_SECRET
  private accessToken: string | null = null

  async fetchTrendingTopics(limit = 50): Promise<TwitchTopic[]> {
    try {
      if (!this.clientId || !this.clientSecret) {
        console.warn('Twitch credentials not configured, using demo data')
        return this.getDemoData(limit)
      }

      // Get access token
      await this.getAccessToken()

      if (!this.accessToken) {
        return this.getDemoData(limit)
      }

      // Fetch top games
      const gamesResponse = await fetch(`${this.baseUrl}/games/top?first=20`, {
        headers: {
          'Client-ID': this.clientId,
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      const gamesData = await gamesResponse.json()
      const games: TwitchGame[] = gamesData.data

      // Fetch top streams for each game
      const streamPromises = games.slice(0, 10).map((game) =>
        fetch(`${this.baseUrl}/streams?game_id=${game.id}&first=5`, {
          headers: {
            'Client-ID': this.clientId!,
            Authorization: `Bearer ${this.accessToken}`,
          },
        }).then((res) => res.json())
      )

      const streamsData = await Promise.all(streamPromises)
      const allStreams: TwitchStream[] = streamsData.flatMap((data) => data.data)

      return this.transformStreams(allStreams).slice(0, limit)
    } catch (error) {
      console.error('Error fetching Twitch data:', error)
      return this.getDemoData(limit)
    }
  }

  private async getAccessToken(): Promise<void> {
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId!,
          client_secret: this.clientSecret!,
          grant_type: 'client_credentials',
        }),
      })

      const data = await response.json()
      this.accessToken = data.access_token
    } catch (error) {
      console.error('Error getting Twitch access token:', error)
    }
  }

  private transformStreams(streams: TwitchStream[]): TwitchTopic[] {
    return streams.map((stream) => ({
      platform: 'Twitch',
      title: stream.title,
      description: `${stream.game_name} • ${stream.viewer_count.toLocaleString()} viewers`,
      url: `https://twitch.tv/${stream.user_login}`,
      score: stream.viewer_count,
      engagement: stream.viewer_count,
      timestamp: new Date(stream.started_at),
      category: this.detectCategory(stream.game_name),
      tags: [stream.game_name.toLowerCase(), stream.language],
      topic: 'gaming',
      author: stream.user_name,
    }))
  }

  private getDemoData(limit: number): TwitchTopic[] {
    const demoStreams = [
      {
        title: 'Just Chatting with viewers!',
        game: 'Just Chatting',
        viewers: 45000,
        streamer: 'Pokimane',
        language: 'en',
      },
      {
        title: 'League of Legends Ranked',
        game: 'League of Legends',
        viewers: 32000,
        streamer: 'Faker',
        language: 'ko',
      },
      {
        title: 'Minecraft Survival Mode',
        game: 'Minecraft',
        viewers: 28000,
        streamer: 'Dream',
        language: 'en',
      },
      {
        title: 'Valorant Tournament',
        game: 'VALORANT',
        viewers: 15000,
        streamer: 'Shroud',
        language: 'en',
      },
      {
        title: 'Fortnite Battle Royale',
        game: 'Fortnite',
        viewers: 12000,
        streamer: 'Ninja',
        language: 'en',
      },
    ]

    return demoStreams.slice(0, limit).map((stream) => ({
      platform: 'Twitch',
      title: stream.title,
      description: `${stream.game} • ${stream.viewers.toLocaleString()} viewers`,
      url: `https://twitch.tv/${stream.streamer.toLowerCase()}`,
      score: stream.viewers,
      engagement: stream.viewers,
      timestamp: new Date(),
      category: this.detectCategory(stream.game),
      tags: [stream.game.toLowerCase(), stream.language],
      topic: 'gaming',
      author: stream.streamer,
    }))
  }

  private detectCategory(gameName: string): string {
    const lowerGame = gameName.toLowerCase()

    if (lowerGame.includes('chatting') || lowerGame.includes('irl')) {
      return 'entertainment'
    }
    if (lowerGame.includes('league') || lowerGame.includes('dota') || lowerGame.includes('valorant')) {
      return 'moba'
    }
    if (lowerGame.includes('minecraft') || lowerGame.includes('roblox')) {
      return 'sandbox'
    }
    if (lowerGame.includes('fortnite') || lowerGame.includes('apex') || lowerGame.includes('pubg')) {
      return 'battle-royale'
    }
    if (lowerGame.includes('fps') || lowerGame.includes('shooter')) {
      return 'fps'
    }

    return 'gaming'
  }
}

export const twitchService = new TwitchService()
