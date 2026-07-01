import React from 'react'
import { IconMapPin, IconCalendar } from '@tabler/icons-react'
import type { LostItem, FoundItem } from '@/types'

interface ItemCardProps {
  item: LostItem | FoundItem
  onViewDetails: (id: string) => void
  action?: {
    label: string
    onClick: (id: string) => void
  }
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onViewDetails,
  action,
}) => {
  const getDate = (item: LostItem | FoundItem) => {
    if ('date_lost' in item) return item.date_lost
    if ('date_found' in item) return item.date_found
    return ''
  }

  const dateStr = getDate(item)
  const date = new Date(dateStr).toLocaleDateString()

  return (
    <div className="card">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.item_name}
          className="mb-4 h-40 w-full rounded-lg object-cover"
        />
      )}
      <h3 className="text-lg font-semibold text-gray-900">{item.item_name}</h3>
      <p className="line-clamp-2 text-sm text-gray-600">{item.description}</p>

      <div className="mt-3 space-y-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <IconMapPin className="h-4 w-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <IconCalendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onViewDetails(item.id)}
          className="flex-1 rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
        >
          View Details
        </button>
        {action && (
          <button
            onClick={() => action.onClick(item.id)}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
