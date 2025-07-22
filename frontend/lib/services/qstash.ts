import { dataFetcherService } from './dataFetcher'

interface QStashMessage {
  body: string
  headers: Record<string, string>
}

export class QStashService {
  private token: string
  private baseUrl: string

  constructor() {
    this.token = process.env.QSTASH_TOKEN || ''
    this.baseUrl = 'https://qstash.upstash.io'
  }

  async scheduleCronJob(): Promise<void> {
    if (!this.token) {
      console.log('QStash token not configured')
      return
    }

    try {
      // Schedule job to run every 15 minutes
      const response = await fetch(`${this.baseUrl}/v2/schedules`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cron: '*/15 * * * *',
          destination: `${process.env.VERCEL_URL}/api/cron/update-database`,
          headers: {
            Authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
        }),
      })

      if (response.ok) {
        console.log('✅ QStash cron job scheduled successfully')
      } else {
        console.error('❌ Failed to schedule QStash cron job:', response.statusText)
      }
    } catch (error) {
      console.error('❌ QStash scheduling error:', error)
    }
  }

  async handleWebhook(request: Request): Promise<Response> {
    try {
      const body = await request.text()
      const message: QStashMessage = JSON.parse(body)

      // Verify the message is for our endpoint
      if (message.headers['Authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
      }

      // Run the database update
      await dataFetcherService.updateDatabaseWithFreshData()

      return new Response('OK', { status: 200 })
    } catch (error) {
      console.error('❌ QStash webhook error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

export const qstashService = new QStashService()
