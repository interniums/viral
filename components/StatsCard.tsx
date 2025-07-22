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
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700'
    }
  }

  return (
    <div className={`card p-6 border-2 min-w-[200px] flex-shrink-0 ${getColorClasses(color)} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
        </div>
        <div className="text-2xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}
