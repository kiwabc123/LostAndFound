import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLostItem } from '@/hooks/useApi'
import { LoadingSpinner } from '@/components/common'

export const LostItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: item, isLoading, isError } = useLostItem(id ?? '')

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading item..." />
      </div>
    )
  }

  if (isError || !item) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-700 font-medium">Item not found or you don't have access.</p>
        <button
          onClick={() => navigate('/lost-items')}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Lost Items
        </button>
      </div>
    )
  }

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })

  const statusColor: Record<string, string> = {
    lost: 'bg-red-100 text-red-700',
    found: 'bg-green-100 text-green-700',
    claimed: 'bg-blue-100 text-blue-700',
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/lost-items')}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Lost Item Details</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">{item.item_name}</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[item.status] ?? 'bg-gray-100 text-gray-700'}`}>
            {item.status}
          </span>
        </div>

        {/* Image */}
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full rounded-lg object-cover max-h-64"
          />
        )}

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</p>
            <p className="mt-1 text-gray-800">{item.description}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Location Lost</p>
            <p className="mt-1 text-gray-800">{item.location}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Date Lost</p>
            <p className="mt-1 text-gray-800">{formatDate(item.date_lost)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Reported On</p>
            <p className="mt-1 text-gray-800">{formatDate(item.created_at)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={() => navigate('/matches')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            View Matches
          </button>
          <button
            onClick={() => navigate('/lost-items')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}
