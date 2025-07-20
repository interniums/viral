# Viral Trending Topics Website

A real-time viral trending topics aggregator that fetches data from Reddit, Twitter/X, and other social platforms to display the most viral content across the internet.

## Features

- 🔥 **Real-time Trending Topics** - Live updates from multiple social platforms
- 📊 **Analytics Dashboard** - Trending metrics and insights
- 🎨 **Modern UI/UX** - Beautiful, responsive design
- 🔄 **Auto-refresh** - Automatic content updates
- 📱 **Mobile Responsive** - Works on all devices
- 🚀 **Fast Performance** - Optimized for speed

## Tech Stack

### Backend

- **Python Flask** - API server
- **Reddit API** - Trending subreddits and posts
- **Twitter/X API** - Trending topics and hashtags
- **WebSocket** - Real-time updates
- **SQLite** - Data storage

### Frontend

- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Chart.js** - Analytics charts
- **Socket.io** - Real-time client updates

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd viral
   ```

2. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your API keys (see API Keys section below)
   ```

4. **Start the backend**

   ```bash
   python start.py
   ```

5. **Set up and start the frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Open your browser**
   ```
   Backend API: http://localhost:5000
   Frontend: http://localhost:3000
   ```

### Option 2: Manual Setup

1. **Backend Setup**

   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Create environment file
   cp env.example .env
   # Edit .env with your API keys

   # Start backend server
   python app.py
   ```

2. **Frontend Setup**

   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install Node.js dependencies
   npm install

   # Start development server
   npm run dev
   ```

## API Keys Required

To fetch trending data, you'll need API keys from the following services:

### Required APIs

- **Reddit API** - Get from https://www.reddit.com/prefs/apps
  - Create a new app (script type)
  - Note down Client ID and Client Secret
- **News API** - Get from https://newsapi.org/
  - Free tier allows 1000 requests/day
  - Sign up and get your API key

### Optional APIs

- **YouTube Data API** - Get from https://console.cloud.google.com/

  - Enable YouTube Data API v3
  - Create API credentials
  - Free tier allows 10,000 requests/day
  - Provides real trending video data

- **Twitter/X API** - Get from https://developer.twitter.com/
  - Requires developer account approval
  - Free tier has limited access
  - Can work without this API (other sources will still work)

### Setting Up API Keys

1. Copy the environment template:

   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```env
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   NEWS_API_KEY=your_news_api_key
   # Optional: YouTube Data API key
   YOUTUBE_API_KEY=your_youtube_api_key
   # Optional: Twitter API keys
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   ```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**

   ```bash
   pip install -r requirements.txt
   ```

2. **Frontend won't start**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **No trending topics showing**

   - Check your API keys in `.env`
   - Ensure APIs are working (check console logs)
   - Some APIs have rate limits

4. **Database errors**
   - Delete `viral_trends.db` and restart
   - The database will be recreated automatically

### Development Tips

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- API endpoints are available at `/api/*`
- Check browser console for frontend errors
- Check terminal for backend errors

### Testing Without API Keys

If you don't have API keys yet, you can test the application with demo data:

```bash
# Generate demo data
python demo_data.py

# Start the backend
python app.py

# Start the frontend (in another terminal)
cd frontend
npm install
npm run dev
```

This will populate the database with sample trending topics from all platforms.

## Project Structure

```
viral/
├── app.py                    # Flask backend server
├── start.py                  # Automated startup script
├── demo_data.py              # Demo data generator for testing
├── requirements.txt          # Python dependencies
├── env.example              # Environment variables template
├── viral_trends.db          # SQLite database (created automatically)
├── frontend/                # Next.js frontend
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── globals.css      # Global styles with Tailwind
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main page component
│   ├── components/          # React components
│   │   ├── TrendingCard.tsx # Individual topic card
│   │   ├── StatsCard.tsx    # Statistics display card
│   │   └── PlatformFilter.tsx # Platform filter component
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Main types file
│   ├── package.json         # Node.js dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── next.config.js       # Next.js configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── postcss.config.js    # PostCSS configuration
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes!
