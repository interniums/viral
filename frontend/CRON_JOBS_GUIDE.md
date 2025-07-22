# Cron Jobs Alternatives Guide

This guide shows you how to implement cron jobs using different services instead of Vercel's built-in cron jobs.

## 🎯 Why Use Alternatives?

- **Vercel Cron**: Limited to Vercel Pro plan ($20/month)
- **GitHub Actions**: Free for public repos, included in GitHub plans
- **External Services**: Often free tiers available
- **More Control**: Custom scheduling and monitoring

## 🔄 Available Options

### 1. **GitHub Actions** (Recommended)

- **Cost**: Free for public repos, included in GitHub plans
- **Reliability**: High (GitHub infrastructure)
- **Setup**: Easy (YAML file)
- **Monitoring**: Built into GitHub

### 2. **Upstash QStash**

- **Cost**: Free tier available
- **Reliability**: High (serverless queue)
- **Setup**: Medium complexity
- **Features**: Retry logic, webhook support

### 3. **Cron-job.org**

- **Cost**: Free tier available
- **Reliability**: Good
- **Setup**: Simple web interface
- **Features**: Email notifications, monitoring

### 4. **Manual API Endpoint**

- **Cost**: Free
- **Reliability**: Depends on external service
- **Setup**: Very simple
- **Use Case**: External cron services

## 🚀 Setup Instructions

### Option 1: GitHub Actions

#### Step 1: Create Workflow File

The file `.github/workflows/cron-update.yml` is already created.

#### Step 2: Set GitHub Secrets

In your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   ```
   VERCEL_URL=https://your-app.vercel.app
   CRON_SECRET=your_secret_key
   ```

#### Step 3: Enable Actions

1. Go to Actions tab in GitHub
2. Enable GitHub Actions for your repository
3. The workflow will run automatically every 15 minutes

#### Step 4: Test Manual Trigger

1. Go to Actions → "Database Update Cron Job"
2. Click "Run workflow" to test manually

### Option 2: Upstash QStash

#### Step 1: Create Upstash Account

1. Go to [upstash.com](https://upstash.com)
2. Create account and get API token

#### Step 2: Set Environment Variables

```bash
QSTASH_TOKEN="your_qstash_token"
CRON_SECRET="your_secret_key"
VERCEL_URL="https://your-app.vercel.app"
```

#### Step 3: Schedule the Job

```bash
# Call this once to schedule the job
curl -X POST "https://your-app.vercel.app/api/cron/schedule-qstash" \
  -H "Authorization: Bearer your_secret_key"
```

#### Step 4: Create Schedule Endpoint

```typescript
// app/api/cron/schedule-qstash/route.ts
import { NextResponse } from 'next/server'
import { qstashService } from '../../../../lib/services/qstash'

export async function POST() {
  await qstashService.scheduleCronJob()
  return NextResponse.json({ success: true })
}
```

### Option 3: Cron-job.org

#### Step 1: Create Account

1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Get API key from dashboard

#### Step 2: Set Environment Variables

```bash
CRONJOB_API_KEY="your_cronjob_api_key"
CRON_SECRET="your_secret_key"
VERCEL_URL="https://your-app.vercel.app"
```

#### Step 3: Create Job via API

```bash
curl -X POST "https://your-app.vercel.app/api/cron/schedule-cronjob" \
  -H "Authorization: Bearer your_secret_key"
```

#### Step 4: Create Schedule Endpoint

```typescript
// app/api/cron/schedule-cronjob/route.ts
import { NextResponse } from 'next/server'
import { cronJobOrgService } from '../../../../lib/services/cronJobOrg'

export async function POST() {
  await cronJobOrgService.createCronJob()
  return NextResponse.json({ success: true })
}
```

### Option 4: Manual API Endpoint

#### Step 1: Use External Cron Service

Any external cron service can call:

```
GET/POST https://your-app.vercel.app/api/cron/manual
Authorization: Bearer your_secret_key
```

#### Step 2: Popular Free Services

- **Cron-job.org**: Web interface, free tier
- **EasyCron**: Simple setup, free tier
- **SetCronJob**: Web-based, free tier
- **Cronitor**: Monitoring included, free tier

## 📊 Comparison Table

| Service            | Cost      | Reliability | Setup     | Monitoring | Best For          |
| ------------------ | --------- | ----------- | --------- | ---------- | ----------------- |
| **GitHub Actions** | Free\*    | High        | Easy      | Built-in   | Most users        |
| **Upstash QStash** | Free tier | High        | Medium    | Built-in   | Serverless apps   |
| **Cron-job.org**   | Free tier | Good        | Easy      | Web UI     | Simple needs      |
| **Manual API**     | Free      | Variable    | Very Easy | External   | External services |

\*Free for public repos, included in GitHub plans

## 🔧 Configuration Examples

### GitHub Actions (Recommended)

```yaml
# .github/workflows/cron-update.yml
name: Database Update Cron Job
on:
  schedule:
    - cron: '*/15 * * * *' # Every 15 minutes
  workflow_dispatch: # Manual trigger

jobs:
  update-database:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger update
        run: |
          curl -X GET "${{ secrets.VERCEL_URL }}/api/cron/manual" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### QStash Configuration

```typescript
// Schedule every 15 minutes
{
  cron: '*/15 * * * *',
  destination: 'https://your-app.vercel.app/api/cron/manual',
  headers: {
    'Authorization': 'Bearer your_secret_key'
  }
}
```

### Cron-job.org Configuration

```json
{
  "title": "Database Update",
  "url": "https://your-app.vercel.app/api/cron/manual",
  "schedule": {
    "timezone": "UTC",
    "hours": [-1],
    "mds": [-1],
    "months": [-1],
    "wdays": [-1]
  },
  "headers": [
    {
      "name": "Authorization",
      "value": "Bearer your_secret_key"
    }
  ]
}
```

## 🚨 Security Considerations

### Authentication

All endpoints require the `CRON_SECRET`:

```bash
Authorization: Bearer your_secret_key
```

### Rate Limiting

- **GitHub Actions**: 1000 requests/hour per repo
- **QStash**: 100 requests/day free tier
- **Cron-job.org**: 5 jobs free tier

### Monitoring

- **GitHub Actions**: Built-in logs and notifications
- **QStash**: Webhook delivery status
- **Cron-job.org**: Email notifications, web dashboard

## 🆘 Troubleshooting

### Common Issues

1. **Job Not Running**

   - Check authentication (CRON_SECRET)
   - Verify endpoint URL
   - Check service status

2. **Rate Limits**

   - Monitor usage in service dashboard
   - Consider upgrading plan
   - Implement retry logic

3. **Failed Requests**
   - Check Vercel function logs
   - Verify environment variables
   - Test endpoint manually

### Debug Commands

```bash
# Test endpoint manually
curl -X GET "https://your-app.vercel.app/api/cron/manual" \
  -H "Authorization: Bearer your_secret_key"

# Check Vercel logs
vercel logs

# Test GitHub Actions locally
act -j update-database
```

## 🎯 Recommendation

**For most users**: Use **GitHub Actions**

- Free and reliable
- Easy to set up
- Good monitoring
- No external dependencies

**For advanced users**: Use **Upstash QStash**

- More features (retry, queuing)
- Better for complex workflows
- Serverless architecture

**For simple needs**: Use **Cron-job.org**

- Web interface
- No code required
- Email notifications

## 📝 Migration from Vercel Cron

If you're currently using Vercel cron jobs:

1. **Choose alternative** from above
2. **Set up new cron job** using chosen service
3. **Test thoroughly** before disabling Vercel cron
4. **Update vercel.json** to remove cron configuration
5. **Monitor** new service for reliability

## 🔮 Future Enhancements

### Advanced Features

- **Retry Logic**: Automatic retry on failure
- **Monitoring**: Email/Slack notifications
- **Logging**: Detailed execution logs
- **Scheduling**: Dynamic schedule changes

### Integration Options

- **Slack**: Notifications on job completion
- **Discord**: Webhook notifications
- **Email**: Status reports
- **Dashboard**: Custom monitoring UI
