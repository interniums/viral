import { memo } from 'react'
import { StatsCardProps } from '../types'

// Pre-computed color classes for better performance
const COLOR_CLASSES = {
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  red: 'bg-red-50 border-red-200 text-red-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  gray: 'bg-gray-50 border-gray-200 text-gray-700',
  pink: 'bg-pink-50 border-pink-200 text-pink-700',
} as const

const StatsCard = memo(function StatsCard({ title, value, icon, color, className = '' }: StatsCardProps) {
  const colorClasses = COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.gray

  return (
    <div className={`card p-6 border-2 min-w-[240px] flex-shrink-0 ${colorClasses} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium opacity-80 truncate leading-tight select-text"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {title}
          </p>
          <p className="text-3xl font-bold mt-1 leading-tight select-text" onMouseDown={(e) => e.stopPropagation()}>
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className="text-2xl opacity-80 flex-shrink-0 flex items-center justify-center"
          style={{ minWidth: '32px' }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
})

export default StatsCard
