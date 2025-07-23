import Image from 'next/image'
import { PLATFORMS } from '../lib/constants/index'

interface PlatformIconProps {
  platform: string
  size?: number
  className?: string
}

// Create platform logos object from centralized constants
const platformLogos: Record<string, string> = {}
PLATFORMS.forEach((platform) => {
  platformLogos[platform.key] = platform.icon
})

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
