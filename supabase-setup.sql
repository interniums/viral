-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Create the trending_topics table
CREATE TABLE IF NOT EXISTS public.trending_topics (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    score INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    category TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    topic TEXT DEFAULT 'general',
    author TEXT DEFAULT 'Unknown',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trending_topics_platform ON public.trending_topics(platform);
CREATE INDEX IF NOT EXISTS idx_trending_topics_timestamp ON public.trending_topics(timestamp);
CREATE INDEX IF NOT EXISTS idx_trending_topics_topic ON public.trending_topics(topic);
CREATE INDEX IF NOT EXISTS idx_trending_topics_engagement ON public.trending_topics(engagement);
CREATE INDEX IF NOT EXISTS idx_trending_topics_score ON public.trending_topics(score);

-- Create unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_topics_unique 
ON public.trending_topics(platform, title, url) 
WHERE url IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for this app, we want full access)
CREATE POLICY "Allow all operations on trending_topics" ON public.trending_topics
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON public.trending_topics TO authenticated;
GRANT ALL ON public.trending_topics TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.trending_topics_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.trending_topics_id_seq TO anon;

-- Insert some sample data (optional)
INSERT INTO public.trending_topics (platform, title, description, url, score, engagement, category, topic, author) VALUES
('Reddit', 'Sample Reddit Post', 'This is a sample Reddit post for testing', 'https://reddit.com/r/sample', 1000, 500, 'technology', 'technology', 'reddit_user'),
('YouTube', 'Sample YouTube Video', 'This is a sample YouTube video for testing', 'https://youtube.com/watch?v=sample', 5000, 2000, 'entertainment', 'entertainment', 'youtube_creator'),
('Google Trends', 'Sample Trend', 'This is a sample Google Trends topic for testing', 'https://trends.google.com/sample', 100, 50, 'general', 'general', 'google_trends'); 

-- Create function to get platform stats
CREATE OR REPLACE FUNCTION get_platform_stats(days_ago integer)
RETURNS TABLE (platform text, count bigint) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT tt.platform, COUNT(*) as count
  FROM trending_topics tt
  WHERE tt.timestamp > NOW() - (days_ago * INTERVAL '1 day')
  GROUP BY tt.platform;
END;
$$;

-- Create function to get topic stats
CREATE OR REPLACE FUNCTION get_topic_stats(days_ago integer)
RETURNS TABLE (topic text, count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT tt.topic, COUNT(*) as count
  FROM trending_topics tt
  WHERE tt.timestamp > NOW() - (days_ago * INTERVAL '1 day')
  AND tt.topic IS NOT NULL
  GROUP BY tt.topic;
END;
$$; 