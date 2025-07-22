# Vercel Postgres Setup Guide

This guide will help you set up Vercel Postgres for your Viral Trending Topics application.

## 🎯 What is Vercel Postgres?

Vercel Postgres is Vercel's own managed PostgreSQL service. It's not a third-party service like Supabase - it's built and managed by Vercel specifically for Vercel deployments.

### Key Features

- **Native Integration**: Works seamlessly with Vercel deployments
- **Automatic Connection Pooling**: Optimized for serverless functions
- **Built-in Monitoring**: Database metrics in Vercel dashboard
- **Automatic Backups**: Daily backups included
- **Environment Variables**: Automatically configured in your project

## 🚀 Setup Steps

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**

   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Navigate to Storage**

   - Click on "Storage" in the left sidebar
   - Click "Create Database"

3. **Choose Postgres**

   - Select "Postgres" as the database type
   - Choose your region (closest to your users)

4. **Select Plan**

   - **Hobby**: Free tier (limited connections, storage)
   - **Pro**: $20/month (more connections, storage, backups)
   - **Enterprise**: Custom pricing

5. **Create Database**
   - Click "Create Database"
   - Wait for provisioning (usually 1-2 minutes)

### Step 2: Configure Environment Variables

Vercel will automatically add these environment variables to your project:

```bash
# These are automatically added by Vercel
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

**Important**: Use `POSTGRES_URL` as your `DATABASE_URL` in your `.env.local`:

```bash
DATABASE_URL="${POSTGRES_URL}"
```

### Step 3: Local Development Setup

1. **Copy Environment Variables**

   - Go to your Vercel project settings
   - Copy the environment variables to your `.env.local`

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Generate Database Schema**

   ```bash
   npm run db:generate
   ```

4. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

### Step 4: Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Add Vercel Postgres setup"
   git push
   ```

2. **Deploy**
   - Vercel will automatically deploy
   - Database migrations will run automatically

## 🔧 Configuration

### Drizzle Configuration

Your `drizzle.config.ts` should look like this:

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
```

### Database Connection

Your `lib/db/index.ts` should use the Vercel Postgres URL:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)
export const db = drizzle(client, { schema })
```

## 📊 Monitoring

### Vercel Dashboard

- **Storage Tab**: View database metrics
- **Functions Tab**: Monitor API performance
- **Analytics Tab**: Track usage and performance

### Database Metrics

- Connection count
- Query performance
- Storage usage
- Backup status

## 🔒 Security

### Connection Security

- All connections are encrypted (TLS)
- Automatic connection pooling
- Environment variables are encrypted

### Access Control

- Database access limited to your Vercel project
- No direct database access (managed service)
- Automatic IP allowlisting

## 💰 Pricing

### Hobby Plan (Free)

- 256MB storage
- 10 concurrent connections
- Daily backups
- Perfect for development and small apps

### Pro Plan ($20/month)

- 8GB storage
- 100 concurrent connections
- Daily backups
- Better for production apps

### Enterprise Plan

- Custom storage and connections
- Custom backup schedules
- Dedicated support
- For large-scale applications

## 🚨 Important Notes

### Connection Limits

- **Hobby**: 10 concurrent connections
- **Pro**: 100 concurrent connections
- Monitor usage in Vercel dashboard

### Storage Limits

- **Hobby**: 256MB
- **Pro**: 8GB
- Upgrade when approaching limits

### Backup Strategy

- Daily automatic backups
- 7-day retention on Hobby plan
- 30-day retention on Pro plan

## 🔄 Migration from Other Databases

### From SQLite

```bash
# Use the provided migration script
npm run migrate-data
```

### From Other PostgreSQL

1. Export data from source database
2. Import to Vercel Postgres using pg_dump/pg_restore
3. Run migrations: `npm run db:migrate`

## 🆘 Troubleshooting

### Common Issues

1. **Connection Errors**

   - Check `DATABASE_URL` format
   - Verify environment variables are set
   - Check connection limits

2. **Migration Failures**

   - Ensure database is created
   - Check schema compatibility
   - Verify Drizzle configuration

3. **Performance Issues**
   - Monitor connection pool usage
   - Check query performance
   - Consider upgrading plan

### Support

- **Vercel Support**: Available in dashboard
- **Documentation**: [vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres)
- **Community**: Vercel Discord and forums

## 🎉 Next Steps

After setting up Vercel Postgres:

1. **Test the Application**

   - Verify all API endpoints work
   - Check database connections
   - Monitor performance

2. **Set Up Monitoring**

   - Enable Vercel Analytics
   - Monitor database metrics
   - Set up alerts if needed

3. **Optimize Performance**

   - Review query performance
   - Optimize connection usage
   - Consider caching strategies

4. **Scale as Needed**
   - Monitor usage patterns
   - Upgrade plan when necessary
   - Consider read replicas for high traffic
