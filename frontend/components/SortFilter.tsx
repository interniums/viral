import { SortFilterProps } from '../types'

export default function SortFilter({ selectedSort, onSortChange, selectedOrder, onOrderChange }: SortFilterProps) {
  const sortOptions = [
    { value: 'random', label: 'Random', icon: '🎲' },
    { value: 'engagement', label: 'Viral', icon: '🔥' },
    { value: 'date', label: 'Date', icon: '📅' },
  ]

  const orderOptions = [
    { value: 'desc', label: '↓', icon: '↓' },
    { value: 'asc', label: '↑', icon: '↑' },
  ]

  const isRandomSelected = selectedSort === 'random'

  return (
    <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 text-sm">
      {/* Sort By */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 font-medium hidden sm:inline">Sort:</span>
        <div className="flex space-x-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedSort === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={option.label}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Order - Always show but deactivate when random is chosen */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 font-medium hidden sm:inline">Order:</span>
        <div className="flex space-x-2">
          {orderOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => !isRandomSelected && onOrderChange(option.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isRandomSelected
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : selectedOrder === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={
                isRandomSelected
                  ? 'Not available for random sorting'
                  : option.value === 'desc'
                  ? 'Descending'
                  : 'Ascending'
              }
              disabled={isRandomSelected}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
