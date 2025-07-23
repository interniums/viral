import { StatsCardProps } from '../types'

export default function StatsCard({ title, value, icon, color, className = '' }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'green':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'orange':
        return 'bg-orange-50 border-orange-200 text-orange-700'
      case 'red':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      case 'gray':
        return 'bg-gray-50 border-gray-200 text-gray-700'
      case 'pink':
        return 'bg-pink-50 border-pink-200 text-pink-700'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className={`card p-6 border-2 min-w-[240px] flex-shrink-0 ${getColorClasses(color)} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium opacity-80 truncate leading-tight">{title}</p>
          <p className="text-3xl font-bold mt-1 leading-tight">{value.toLocaleString()}</p>
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
}
