import React from 'react'
import { IconAlertCircle } from '@tabler/icons-react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-8 text-center">
      <IconAlertCircle className="h-12 w-12 text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
