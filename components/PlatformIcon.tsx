import Image from 'next/image'

interface PlatformIconProps {
  platform: string
  size?: number
  className?: string
}

const platformLogos = {
  Reddit: '/images/platforms/reddit.svg',
  YouTube: '/images/platforms/youtube.svg',
  'Google Trends': '/images/platforms/google-trends.svg',
  Instagram: '/images/platforms/instagram.svg',
  Facebook: '/images/platforms/facebook.svg',
  Telegram: '/images/platforms/telegram.svg',
  Twitter: '/images/platforms/twitter.svg',
}

export default function PlatformIcon({ platform, size = 24, className = '' }: PlatformIconProps) {
  const logoPath = platformLogos[platform as keyof typeof platformLogos]

  if (!logoPath) {
    return (
      <span className={className} style={{ fontSize: size }}>
        {platform.charAt(0).toUpperCase()}
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
      />
    </span>
  )
}
