import { pgTable, serial, text, integer, timestamp, jsonb, uniqueIndex } from 'drizzle-orm/pg-core'

export const trendingTopics = pgTable(
  'trending_topics',
  {
    id: serial('id').primaryKey(),
    platform: text('platform').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    url: text('url'),
    score: integer('score').default(0),
    engagement: integer('engagement').default(0),
    timestamp: timestamp('timestamp').defaultNow(),
    category: text('category'),
    tags: jsonb('tags').$type<string[]>(),
    topic: text('topic').default('general'),
    author: text('author').default('Unknown'),
  },
  (table) => ({
    platformTitleUrlIdx: uniqueIndex('platform_title_url_idx').on(table.platform, table.title, table.url),
  })
)

export type TrendingTopic = typeof trendingTopics.$inferSelect
export type NewTrendingTopic = typeof trendingTopics.$inferInsert
