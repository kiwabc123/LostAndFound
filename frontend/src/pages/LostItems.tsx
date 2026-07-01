import React, { useState } from 'react'
import { useLostItems } from '@/hooks/useApi'
import { LoadingSpinner, EmptyState, ItemCard } from '@/components/common'
import { useNavigate } from 'react-router-dom'
import { LostItem } from '@/types'

export const LostItems: React.FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLostItems(page, 12)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost Items</h1>
          <p className="mt-2 text-gray-600">
            Browse items reported as lost
          </p>
        </div>
        <button
          onClick={() => navigate('/lost-items/report')}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Report Lost Item
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner message="Loading items..." />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item: LostItem) => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={(id) => navigate(`/lost-items/${id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {Math.ceil((data?.total || 0) / 12)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page >= Math.ceil(data.total / 12)}
              className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          title="No lost items found"
          description="Be the first to report a lost item"
          action={{
            label: 'Report Lost Item',
            onClick: () => navigate('/lost-items/report'),
          }}
        />
      )}
    </div>
  )
}
