import { dataFetcherService } from './dataFetcher'

export class CronJobOrgService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.CRONJOB_API_KEY || ''
    this.baseUrl = 'https://api.cron-job.org'
  }

  async createCronJob(): Promise<void> {
    if (!this.apiKey) {
      console.log('Cron-job.org API key not configured')
      return
    }

    try {
      const response = await fetch(`${this.baseUrl}/jobs`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job: {
            title: 'Viral Trending Database Update',
            url: `${process.env.VERCEL_URL}/api/cron/update-database`,
            enabled: true,
            saveResponses: true,
            schedule: {
              timezone: 'UTC',
              hours: [-1], // Every hour
              mds: [-1], // Every day
              months: [-1], // Every month
              wdays: [-1], // Every weekday
            },
            requestMethod: 1, // GET
            headers: [
              {
                name: 'Authorization',
                value: `Bearer ${process.env.CRON_SECRET}`,
              },
            ],
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Cron-job.org job created:', result.jobId)
      } else {
        console.error('❌ Failed to create cron-job.org job:', response.statusText)
      }
    } catch (error) {
      console.error('❌ Cron-job.org error:', error)
    }
  }

  async handleWebhook(request: Request): Promise<Response> {
    try {
      // Verify the request is from cron-job.org
      const authHeader = request.headers.get('authorization')
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
      }

      // Run the database update
      await dataFetcherService.updateDatabaseWithFreshData()

      return new Response('OK', { status: 200 })
    } catch (error) {
      console.error('❌ Cron-job.org webhook error:', error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

export const cronJobOrgService = new CronJobOrgService()
