import Image from 'next/image'

interface PlatformIconProps {
  platform: string
  size?: number
  className?: string
}

const platformLogos = {
  Reddit: '/images/platforms/reddit.svg',
  YouTube: '/images/platforms/youtube.svg',
  News: '/images/platforms/news.svg',
  Instagram: '/images/platforms/instagram.svg',
  Facebook: '/images/platforms/facebook.svg',
  Telegram: '/images/platforms/telegram.svg',
  Twitter: '/images/platforms/twitter.svg',
}

const platformFallbacks = {
  Reddit: '🔴',
  YouTube: '🟣',
  News: '📰',
  Instagram: '🟠',
  Facebook: '🔵',
  Telegram: '🟢',
  Twitter: '🐦',
}

export default function PlatformIcon({ platform, size = 24, className = '' }: PlatformIconProps) {
  const logoPath = platformLogos[platform as keyof typeof platformLogos]
  const fallback = platformFallbacks[platform as keyof typeof platformFallbacks]

  if (!logoPath) {
    return (
      <span className={className} style={{ fontSize: size }}>
        {fallback}
      </span>
    )
  }

  return (
    <span className={className} style={{ width: size, height: size, display: 'inline-block' }}>
      <Image
        src={logoPath}
        alt={`${platform} logo`}
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            const fallbackSpan = document.createElement('span')
            fallbackSpan.textContent = fallback
            fallbackSpan.style.fontSize = `${size}px`
            fallbackSpan.className = className
            parent.appendChild(fallbackSpan)
          }
        }}
      />
    </span>
  )
}
