# GitHub Actions Cron Job Setup Guide

This guide will help you set up GitHub Actions to automatically update your database every 15 minutes.

## 1. GitHub Repository Setup

### Prerequisites

- Your code must be pushed to a GitHub repository
- You need admin access to the repository

## 2. Set Up GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings** → **Secrets and variables** → **Actions**
3. **Click "New repository secret"**
4. **Add the following secrets:**

### Required Secrets

#### `VERCEL_URL`

- **Value**: Your Vercel deployment URL
- **Example**: `https://your-app-name.vercel.app`
- **How to get it**:
  - Deploy your app to Vercel
  - Copy the URL from your Vercel dashboard

#### `CRON_SECRET`

- **Value**: A secure random string (same as your environment variable)
- **Example**: `your-super-secret-cron-key-123`
- **How to generate**: Run `npm run generate-secret` in your project

### Optional Secrets (if needed)

#### `SUPABASE_URL`

- **Value**: Your Supabase project URL
- **Example**: `https://your-project-id.supabase.co`

#### `SUPABASE_ANON_KEY`

- **Value**: Your Supabase anon key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Verify the Workflow File

The workflow file is already created at `.github/workflows/cron-update.yml`. It:

- **Runs every 15 minutes** (`*/15 * * * *`)
- **Can be triggered manually** (workflow_dispatch)
- **Uses Ubuntu latest** runner
- **Installs dependencies** and triggers the update

## 4. Test the Setup

### Manual Test

1. **Go to your GitHub repository**
2. **Navigate to Actions** tab
3. **Click on "Database Update Cron Job"**
4. **Click "Run workflow"** → **"Run workflow"**
5. **Check the logs** to see if it succeeds

### Expected Success Output

```
✅ Database updated successfully with X fresh items
✅ Cron endpoint is working - database updated successfully
```

## 5. Monitor the Cron Jobs

### View Logs

1. **Go to Actions** tab in your repository
2. **Click on "Database Update Cron Job"**
3. **Click on any run** to see detailed logs

### Check Frequency

- **Every 15 minutes**: The job runs automatically
- **Manual runs**: You can trigger it anytime
- **Failed runs**: GitHub will show failed attempts

## 6. Customize the Schedule

### Current Schedule: Every 15 minutes

```yaml
cron: '*/15 * * * *'
```

### Other Common Schedules

#### Every hour

```yaml
cron: '0 * * * *'
```

#### Every 30 minutes

```yaml
cron: '*/30 * * * *'
```

#### Twice daily (6 AM and 6 PM)

```yaml
cron: '0 6,18 * * *'
```

#### Once daily at midnight

```yaml
cron: '0 0 * * *'
```

### Cron Syntax

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

## 7. Troubleshooting

### Common Issues

#### 1. "Secret not found" error

- **Solution**: Make sure you've added the secrets in GitHub
- **Check**: Go to Settings → Secrets and variables → Actions

#### 2. "Unauthorized" error

- **Solution**: Verify your `CRON_SECRET` matches your environment variable
- **Check**: Both GitHub secret and Vercel environment variable should be identical

#### 3. "Connection refused" error

- **Solution**: Check your `VERCEL_URL` is correct
- **Check**: Make sure your app is deployed and accessible

#### 4. "Database connection failed" error

- **Solution**: Verify your Supabase credentials
- **Check**: Test the API endpoint manually first

### Debug Steps

1. **Test manually first**:

   ```bash
   curl -X GET "https://your-app.vercel.app/api/cron/update-database" \
     -H "Authorization: Bearer your-cron-secret"
   ```

2. **Check Vercel logs**:

   - Go to your Vercel dashboard
   - Check Function logs for errors

3. **Verify environment variables**:
   - Make sure all variables are set in Vercel
   - Check that Supabase credentials are correct

## 8. Security Best Practices

### 1. Use Strong Secrets

- Generate a strong `CRON_SECRET` (32+ characters)
- Use different secrets for different environments

### 2. Limit Access

- Only repository admins should have access to secrets
- Use repository secrets, not organization secrets (unless needed)

### 3. Monitor Usage

- Check GitHub Actions usage in your account
- Monitor for unusual activity

## 9. Cost Considerations

### GitHub Actions

- **Free tier**: 2,000 minutes/month for public repos
- **Private repos**: 500 minutes/month free
- **Our usage**: ~2,880 minutes/month (every 15 minutes)
- **Cost**: Free for public repos, ~$4/month for private repos

### Vercel

- **Free tier**: 100GB-hours/month
- **Our usage**: Very low (just API calls)
- **Cost**: Free tier should be sufficient

## 10. Alternative: Vercel Cron Jobs

If you prefer to use Vercel's built-in cron jobs instead:

1. **Create `vercel.json`**:

   ```json
   {
     "crons": [
       {
         "path": "/api/cron/update-database",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```

2. **Add environment variable**:

   ```env
   CRON_SECRET=your-secret-here
   ```

3. **Deploy to Vercel**

## Next Steps

1. **Set up the secrets** in GitHub
2. **Test manually** first
3. **Monitor the logs** for a few runs
4. **Adjust the schedule** if needed
5. **Set up alerts** for failed runs (optional)

Your cron job will now automatically update your database every 15 minutes! 🚀
